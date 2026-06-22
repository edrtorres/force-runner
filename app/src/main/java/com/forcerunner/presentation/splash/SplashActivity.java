package com.forcerunner.presentation.splash;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import androidx.appcompat.app.AppCompatActivity;

import com.forcerunner.ForceRunnerApplication;
import com.forcerunner.MainActivity;
import com.forcerunner.R;
import com.forcerunner.di.AppContainer;
import com.forcerunner.presentation.auth.LoginActivity;

public class SplashActivity extends AppCompatActivity {
    private static final long SPLASH_DELAY_MS = 900;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler(Looper.getMainLooper()).postDelayed(this::openNextScreen, SPLASH_DELAY_MS);
    }

    private void openNextScreen() {
        AppContainer container = ((ForceRunnerApplication) getApplication()).getAppContainer();
        Class<?> target = container.getHasActiveSessionUseCase().execute()
                ? MainActivity.class
                : LoginActivity.class;
        startActivity(new Intent(this, target));
        finish();
    }
}
