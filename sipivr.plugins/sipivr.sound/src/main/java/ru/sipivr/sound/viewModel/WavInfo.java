package ru.sipivr.sound.viewModel;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import ru.sipivr.core.utils.ByteArraySerializer;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;

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
    private int subchunk2Size;

    private byte[] data;

    public WavInfo(String sourcePath) throws Exception {
        try (FileInputStream s = new FileInputStream(sourcePath)) {
            chunkId = readString(s, 4);
            chunkSize = readInt(s);
            format = readString(s, 4);
            subchunk1Id = readString(s, 4);
            subchunk1Size = readInt(s);
            audioFormat = readShort(s);
            numChannels = readShort(s);
            sampleRate = readInt(s);
            byteRate = readInt(s);
            blockAlign = readShort(s);
            bitsPerSample = readShort(s);
            if(subchunk1Size > 16){
                readBytes(s, subchunk1Size - 16);
            }
            subchunk2Id = readString(s, 4);
            subchunk2Size = readInt(s);
            data = readBytes(s, subchunk2Size);
        }
    }

    public void cut(int from, int to){
        byte[] newData = new byte[subchunk2Size - (to - from)];
        for(int i = 0; i < from; i++){
            newData[i] = data[i];
        }
        for(int i = to; i < subchunk2Size; i++){
            newData[i - (to - from)] = data[i];
        }
        subchunk2Size = newData.length;
        data = newData;
    }

    public void save(String targetPath) throws Exception {
        try (FileOutputStream s = new FileOutputStream(targetPath)) {
            writeString(s, chunkId, 4);
            writeInt(s, chunkSize);
            writeString(s, format, 4);
            writeString(s, subchunk1Id, 4);
            writeInt(s, subchunk1Size);
            writeShort(s, audioFormat);
            writeShort(s, numChannels);
            writeInt(s, sampleRate);
            writeInt(s, byteRate);
            writeShort(s, blockAlign);
            writeShort(s, bitsPerSample);
            if (subchunk1Size > 16) {
                s.write(new byte[subchunk1Size - 16]);
            }
            writeString(s, subchunk2Id, 4);
            writeInt(s, subchunk2Size);

            s.write(data);
        }
    }

    private static byte[] readBytes(FileInputStream s, int length) throws Exception {
        byte[] bytes = new byte[length];
        if(s.read(bytes) != length){
            throw new Exception();
        }
        return bytes;
    }

    private static String readString(FileInputStream s, int length) throws Exception {
        byte[] bytes = readBytes(s, length);
        return new String(bytes);
    }

    private static void writeString(FileOutputStream s, String data, int length) throws Exception {
        byte[] bytes = data.getBytes();
        for(int i = 0; i < length;i++){
            if(i < bytes.length) {
                s.write(bytes[i]);
            } else {
                s.write(0);
            }
        }
    }

    private static short readShort(FileInputStream fr) throws Exception {
        return (short) (fr.read() + (fr.read() << 8));
    }

    private static void writeShort(FileOutputStream s, short data) throws Exception {
        byte[] bytes = ByteBuffer.allocate(2).putShort(data).array();
        s.write(bytes[1]);
        s.write(bytes[0]);
    }

    private static int readInt(FileInputStream fr) throws Exception {
        return fr.read() + (fr.read() << 8) + (fr.read() << 16) + (fr.read() << 24);
    }

    private static void writeInt(FileOutputStream s, int data) throws Exception {
        byte[] bytes = ByteBuffer.allocate(4).putInt(data).array();
        s.write(bytes[3]);
        s.write(bytes[2]);
        s.write(bytes[1]);
        s.write(bytes[0]);
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

    public double getDuration(){
        return 1000d * data.length / byteRate;
    }
}