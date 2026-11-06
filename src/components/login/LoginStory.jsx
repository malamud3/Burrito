import React from 'react';

export default function LoginStory({ durationMinutes }) {
  return (
    <section className="login-story" aria-labelledby="login-story-title">
      <div className="login-story-brand">
        <span className="login-mark" aria-hidden="true">B</span>
        <span>Burrito</span>
      </div>
      <p className="login-story-kicker">מרחב ללמידה מתמטית</p>
      <h1 id="login-story-title">
        חוקרים פונקציות.
        <br />
        <span>מגלים את הדרך.</span>
      </h1>
      <p className="login-story-description">
        סביבת למידה ממוקדת לחקירת פונקציות, עם שתי דרכים שונות לארגון החקירה
        וכלים שעוזרים להפוך כל שלב להבנה.
      </p>
      <div className="login-feature-grid" aria-label="מה מחכה לך במרחב">
        <div className="login-feature">
          <span>01</span>
          <strong>מקבלים מסלול</strong>
          <small>בחירה בין שני מסלולים</small>
        </div>
        <div className="login-feature">
          <span>02</span>
          <strong>חוקרים לעומק</strong>
          <small>מתקדמים צעד אחר צעד</small>
        </div>
        <div className="login-feature">
          <span>03</span>
          <strong>מסכמים ומשרטטים</strong>
          <small>מחברים בין הרעיונות</small>
        </div>
      </div>
      <p className="login-session-note">
        <span aria-hidden="true" />
        מפגש למידה של {durationMinutes} דקות, עם כלי שרטוט דיגיטלי
      </p>
    </section>
  );
}
