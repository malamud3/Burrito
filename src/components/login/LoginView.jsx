import React from 'react';
import LearningScreen from '../layout/LearningScreen';
import LoginStory from './LoginStory';
import LoginForm from './LoginForm';

export default function LoginView(props) {
  return (
    <LearningScreen wide className="login-screen" dir="rtl">
      <div className="login-layout">
        <LoginStory durationMinutes={props.durationMinutes} />
        <LoginForm {...props} />
      </div>
    </LearningScreen>
  );
}
