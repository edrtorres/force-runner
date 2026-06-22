package com.forcerunner.data.remote.model.run;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class RunHistoryResponseDto {
    @SerializedName("runs")
    private List<RunDto> runs;

    public List<RunDto> getRuns() {
        return runs;
    }
}
