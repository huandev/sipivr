package ru.sipivr.core.result;

/**
 * Created by Admin on 27.02.2016.
 */
public class Record extends AbstractResult {
    private int duration;
    private String folder;
    private String url;

    public Record(int duration, String folder, String url) {
        this.duration = duration;
        this.folder = folder;
        this.url = url;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getFolder() {
        return folder;
    }

    public void setFolder(String folder) {
        this.folder = folder;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
