// src/components/ReviewChart/index.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./styles.css";

export function ReviewChart({ siteId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const q = query(collection(db, "reviews"), where("siteId", "==", siteId));
      const snap = await getDocs(q);
      setReviews(snap.docs.map((d) => d.data()));
      setLoading(false);
    }
    load();
  }, [siteId]);

  if (loading) {
    return <p className="loading-users">Carregando avaliações de usuários…</p>;
  }

  if (reviews.length === 0) {
    return (
      <p className="no-users">
        Ainda não há avaliações de usuários para este site.
      </p>
    );
  }

  const total = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = (sum / total).toFixed(1); // ex: "4.3"
  const percent = Math.round((parseFloat(avg) / 5) * 100); // 0–100%

  return (
    <div className="user-rating-chart">
      <h3 className="chart-title">Média das avaliações dos usuários</h3>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${percent}%` }}></div>
      </div>
      <p className="chart-info">
        {avg} / 5 ({total} {total === 1 ? "avaliação" : "avaliações"})
      </p>
    </div>
  );
}
