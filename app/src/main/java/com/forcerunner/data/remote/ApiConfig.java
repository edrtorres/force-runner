package com.forcerunner.data.remote;

import com.forcerunner.BuildConfig;

public final class ApiConfig {
    public static final String SUPABASE_BASE_URL = BuildConfig.SUPABASE_BASE_URL;
    public static final String FORCE_RUNNER_API_PATH = BuildConfig.FORCE_RUNNER_API_PATH;
    public static final String SUPABASE_PUBLISHABLE_KEY = BuildConfig.SUPABASE_PUBLISHABLE_KEY;

    private ApiConfig() {
    }
}
