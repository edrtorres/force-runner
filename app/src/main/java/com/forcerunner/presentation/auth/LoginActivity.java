package com.forcerunner.presentation.auth;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.textfield.TextInputEditText;
import com.forcerunner.ForceRunnerApplication;
import com.forcerunner.MainActivity;
import com.forcerunner.R;
import com.forcerunner.di.AppContainer;
import com.forcerunner.domain.common.AppResult;
import com.forcerunner.domain.model.AuthSession;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class LoginActivity extends AppCompatActivity {
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    private TextInputEditText emailInput;
    private TextInputEditText passwordInput;
    private Button loginButton;
    private ProgressBar loadingIndicator;
    private TextView errorText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        loginButton = findViewById(R.id.loginButton);
        loadingIndicator = findViewById(R.id.loadingIndicator);
        errorText = findViewById(R.id.errorText);

        loginButton.setOnClickListener(view -> login());
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        executorService.shutdownNow();
    }

    private void login() {
        String email = getText(emailInput);
        String password = getText(passwordInput);
        setLoading(true);
        errorText.setText("");

        AppContainer container = ((ForceRunnerApplication) getApplication()).getAppContainer();
        executorService.execute(() -> {
            AppResult<AuthSession> result = container.getLoginUseCase().execute(email, password);
            runOnUiThread(() -> handleLoginResult(result));
        });
    }

    private void handleLoginResult(AppResult<AuthSession> result) {
        setLoading(false);
        if (result.isSuccess()) {
            Toast.makeText(this, R.string.login_success, Toast.LENGTH_SHORT).show();
            startActivity(new Intent(this, MainActivity.class));
            finish();
            return;
        }
        errorText.setText(result.getError());
    }

    private void setLoading(boolean loading) {
        loginButton.setEnabled(!loading);
        loadingIndicator.setVisibility(loading ? View.VISIBLE : View.GONE);
    }

    private String getText(TextInputEditText input) {
        return input.getText() != null ? input.getText().toString() : "";
    }
}
