package com.forcerunner;

import android.app.Application;

import com.forcerunner.di.AppContainer;

public class ForceRunnerApplication extends Application {
    private AppContainer appContainer;

    @Override
    public void onCreate() {
        super.onCreate();
        appContainer = new AppContainer(this);
    }

    public AppContainer getAppContainer() {
        return appContainer;
    }
}
