/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import "./styles.css";

export function Reviews({ siteId }) {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1) Monitora auth e recarrega reviews
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      loadReviews();
    });
    return unsubscribe;
  }, [siteId]);

  // 2) Carrega somente avaliações deste site
  async function loadReviews() {
    setLoadingReviews(true);
    try {
      const q = query(
        collection(db, "reviews"),
        where("siteId", "==", siteId)
      );
      const snap = await getDocs(q);
      setReviews(snap.docs.map((d) => d.data()));
    } catch (e) {
      console.error("Erro ao carregar avaliações:", e);
    } finally {
      setLoadingReviews(false);
    }
  }

  // 3) Login via launchWebAuthFlow com prompt=select_account
  async function login() {
    // Busque o client_id no seu firebase.js ou no .env
    const CLIENT_ID = "192440184688-mmiuflgjd2a2cd0ct35dma0kjfbb9pc7.apps.googleusercontent.com";
    const redirectUri = chrome.identity.getRedirectURL("provider_cb");
    const authUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      "?client_id=" +
      encodeURIComponent(CLIENT_ID) +
      "&response_type=token" +
      "&redirect_uri=" +
      encodeURIComponent(redirectUri) +
      "&scope=" +
      encodeURIComponent("openid email profile") +
      "&prompt=select_account";

    try {
      const redirectResponse = await new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
          { url: authUrl, interactive: true },
          (redirectedTo) => {
            if (chrome.runtime.lastError || !redirectedTo) {
              return reject(
                chrome.runtime.lastError || new Error("Autenticação cancelada")
              );
            }
            resolve(redirectedTo);
          }
        );
      });

      // extrai access_token do hash (#access_token=...)
      const hash = new URL(redirectResponse).hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      if (!accessToken) throw new Error("Nenhum access_token retornado");

      // autentica no Firebase
      const credential = GoogleAuthProvider.credential(null, accessToken);
      await signInWithCredential(auth, credential);
    } catch (err) {
      console.error("Erro no login OAuth2:", err);
      alert("Falha ao fazer login: " + err.message);
    }
  }

  // 4) Logout do Firebase
  function logout() {
    signOut(auth).catch(console.error);
  }

  // 5) Envia uma única avaliação por site+usuário
  async function submitReview() {
    if (!user) return;
    setSubmitting(true);
    try {
      const docId = `${siteId}_${user.uid}`;
      const reviewRef = doc(db, "reviews", docId);
      const snap = await getDoc(reviewRef);

      if (snap.exists()) {
        alert("Você já avaliou este site.");
      } else {
        await setDoc(reviewRef, {
          siteId,
          userId: user.uid,
          userName: user.displayName,
          rating,
          comment,
          date: Date.now(),
        });
        await loadReviews();
        setComment("");
        setRating(5);
      }
    } catch (e) {
      console.error("Erro ao enviar avaliação:", e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="reviews-container">
      {user ? (
        <>
          <div className="user-info">
            <span>Olá, {user.displayName}</span>
            <button onClick={logout}>Sair</button>
          </div>

          <div className="review-form">
            <label>
              Nota:
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} ⭐
                  </option>
                ))}
              </select>
            </label>
            <label>
              Comentário:
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="O que achou da acessibilidade?"
              />
            </label>
            <button
              onClick={submitReview}
              disabled={submitting || !comment.trim()}
            >
              {submitting ? "Enviando…" : "Enviar avaliação"}
            </button>
          </div>
        </>
      ) : (
        <div className="login-prompt">
          <p>
            Para enviar uma avaliação,{" "}
            <button onClick={login} className="login-button">
              entre com Google
            </button>
            .
          </p>
        </div>
      )}

      <hr />

      {loadingReviews ? (
        <p>Carregando avaliações…</p>
      ) : (
        <ul className="reviews-list">
          {reviews.length === 0 ? (
            <li>Não há avaliações ainda.</li>
          ) : (
            reviews.map((r, i) => (
              <li key={i} className="review-item">
                <div className="review-header">
                  <strong>{r.userName}</strong>
                  <span className="review-rating">{r.rating} ⭐</span>
                  <span className="review-date">
                    {new Date(r.date).toLocaleString()}
                  </span>
                </div>
                <p className="review-comment">{r.comment}</p>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
