package com.forcerunner.data.remote.model.run;

import com.google.gson.annotations.SerializedName;

public class StatisticsResponseDto {
    @SerializedName("period")
    private String period;

    @SerializedName("statistics")
    private StatisticsDto statistics;

    public String getPeriod() {
        return period;
    }

    public StatisticsDto getStatistics() {
        return statistics;
    }
}
