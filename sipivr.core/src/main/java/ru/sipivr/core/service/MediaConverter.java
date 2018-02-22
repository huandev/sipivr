package ru.sipivr.core.service;

import it.sauronsoftware.jave.*;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import ru.sipivr.core.enums.MediaConverterFormat;
import ru.sipivr.core.utils.UserException;

import java.io.File;

/**
 * Created by Karpukhin on 10.01.2016.
 */
@Service
public class MediaConverter {
    private final Encoder encoder;

    public MediaConverter() throws Exception {
        encoder = new Encoder();

        for (MediaConverterFormat format : MediaConverterFormat.values()) {
            if (!isSupported(format)) {
                throw new UserException("Format " + format.getValue() + " not supported");
            }
        }
    }

    public void convert(File source, File dest) throws EncoderException {
        convert(source, dest, null);
    }

    public void convert(File source, File dest, Integer bitRate) throws EncoderException {
        if (source == null)
            throw new IllegalArgumentException("source must be not null");

        if (dest == null)
            throw new IllegalArgumentException("dest must be not null");

        String sourceFormat = FilenameUtils.getExtension(source.getName());
        if(MediaConverterFormat.valueOf(sourceFormat.toUpperCase()) == null){
            throw new IllegalArgumentException("source format not supported");
        }

        if(!isSupported(MediaConverterFormat.valueOf(sourceFormat.toUpperCase()))){
            throw new IllegalArgumentException("source format not supported");
        }

        String destFormat = FilenameUtils.getExtension(dest.getName());
        if(MediaConverterFormat.valueOf(destFormat.toUpperCase()) == null){
            throw new IllegalArgumentException("dest format not supported");
        }

        if(!isSupported(MediaConverterFormat.valueOf(destFormat.toUpperCase()))){
            throw new IllegalArgumentException("dest format not supported");
        }

        EncodingAttributes attr = new EncodingAttributes() {{
            setFormat(destFormat);
            setAudioAttributes(new AudioAttributes() {{
                if (bitRate != null)
                    setBitRate(bitRate);

                setSamplingRate(16000);
                setChannels(1);
            }});
        }};

        encoder.encode(source, dest, attr);
    }

    private boolean isSupported(MediaConverterFormat format) throws EncoderException {
        for (String fn : encoder.getSupportedEncodingFormats())
            if (fn.equals(format.getValue()))
                return true;

        return false;
    }
}
