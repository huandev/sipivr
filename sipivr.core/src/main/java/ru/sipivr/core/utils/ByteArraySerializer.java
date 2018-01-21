package ru.sipivr.core.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import javax.json.stream.JsonGenerator;
import java.io.IOException;

public class ByteArraySerializer extends JsonSerializer<byte[]> {

    @Override
    public void serialize(byte[] value, com.fasterxml.jackson.core.JsonGenerator gen, SerializerProvider serializers) throws IOException, JsonProcessingException {
        gen.writeStartArray();

        for (byte b : value) {
            gen.writeNumber(unsignedToBytes(b));
        }

        gen.writeEndArray();
    }

    private static int unsignedToBytes(byte b) {
        return b & 0xFF;
    }
}