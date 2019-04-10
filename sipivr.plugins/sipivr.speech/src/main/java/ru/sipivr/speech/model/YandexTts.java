package ru.sipivr.speech.model;

import ru.sipivr.core.model.base.AbstractCreatableEntity;

import javax.persistence.*;

/**
 * Created by Admin on 28.02.2016.
 */
@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = {"text", "format", "quality", "lang", "speaker", "speed", "emotion"}) })
public class YandexTts extends AbstractCreatableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 512)
    private String text;

    @Column(nullable = false, length = 8)
    private String format;

    @Column(nullable = false, length = 4)
    private String quality;

    @Column(nullable = false, length = 8)
    private String lang;

    @Column(nullable = false, length = 8)
    private String speaker;

    @Column(nullable = false, length = 4)
    private String speed;

    @Column(nullable = false, length = 8)
    private String emotion;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public String getSpeaker() {
        return speaker;
    }

    public void setSpeaker(String speaker) {
        this.speaker = speaker;
    }

    public String getSpeed() {
        return speed;
    }

    public void setSpeed(String speed) {
        this.speed = speed;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }

    @Transient
    public String getFileName(){
        return this.getId() + "." + this.getFormat();
    }
}
