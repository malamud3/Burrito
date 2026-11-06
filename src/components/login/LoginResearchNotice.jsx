import React from 'react';

export default function LoginResearchNotice({ durationMinutes }) {
  return (
    <aside className="login-research-notice" role="note">
      <strong>איך זה עובד?</strong>
      <span>
        מתחילים בבוחן מקדים, ממשיכים למסלול שבחרתם למשך {durationMinutes} דקות,
        ומסיימים בבוחן העברה.
      </span>
      <span>
        זו הדגמה מקומית בלבד. הנתונים נשמרים בדפדפן ואינם מתואמים בין מכשירים.
      </span>
    </aside>
  );
}
