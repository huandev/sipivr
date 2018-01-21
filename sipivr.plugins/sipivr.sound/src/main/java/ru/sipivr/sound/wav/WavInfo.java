package ru.sipivr.sound.wav;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.sipivr.core.utils.ByteArraySerializer;

import java.io.FileInputStream;

public class WavInfo {
    private final String chunkId;
    private final int chunkSize;
    private final String format;
    private final String subchunk1Id;
    private final int subchunk1Size;
    private final short audioFormat;
    private final short numChannels;
    private final int sampleRate;
    private final int byteRate;
    private final short blockAlign;
    private final short bitsPerSample;
    private final String subchunk2Id;
    private final int subchunk2Size;

    private final byte[] data;

    public WavInfo(String file) throws Exception {
        try (FileInputStream fr = new FileInputStream(file)) {
            chunkId = readString(fr, 4);
            chunkSize = readInt(fr);
            format = readString(fr, 4);
            subchunk1Id = readString(fr, 4);
            subchunk1Size = readInt(fr);
            audioFormat = readShort(fr);
            numChannels = readShort(fr);
            sampleRate = readInt(fr);
            byteRate = readInt(fr);
            blockAlign = readShort(fr);
            bitsPerSample = readShort(fr);
            subchunk2Id = readString(fr, 4);
            subchunk2Size = readInt(fr);
            data = readBytes(fr, subchunk2Size);
        }
    }

    private static byte[] readBytes(FileInputStream fr, int length) throws Exception {
        byte[] bytes = new byte[length];
        if(fr.read(bytes) != length){
            throw new Exception();
        }
        return bytes;
    }

    private static String readString(FileInputStream fr, int length) throws Exception {
        byte[] bytes = readBytes(fr, length);
        return new String(bytes);
    }

    private static short readShort(FileInputStream fr) throws Exception {
        return (short) (fr.read() + (fr.read() << 8));
    }

    private static int readInt(FileInputStream fr) throws Exception {
        return fr.read() + (fr.read() << 8) + (fr.read() << 16) + (fr.read() << 24);
    }

    public String getChunkId() {
        return chunkId;
    }

    public int getChunkSize() {
        return chunkSize;
    }

    public String getFormat() {
        return format;
    }

    public String getSubchunk1Id() {
        return subchunk1Id;
    }

    public int getSubchunk1Size() {
        return subchunk1Size;
    }

    public short getAudioFormat() {
        return audioFormat;
    }

    public short getNumChannels() {
        return numChannels;
    }

    public int getSampleRate() {
        return sampleRate;
    }

    public int getByteRate() {
        return byteRate;
    }

    public short getBlockAlign() {
        return blockAlign;
    }

    public short getBitsPerSample() {
        return bitsPerSample;
    }

    public String getSubchunk2Id() {
        return subchunk2Id;
    }

    public int getSubchunk2Size() {
        return subchunk2Size;
    }

    @JsonSerialize(using = ByteArraySerializer.class)
    public byte[] getData() {
        return data;
    }
}