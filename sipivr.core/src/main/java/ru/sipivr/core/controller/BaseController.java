package ru.sipivr.core.controller;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.dozer.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import ru.sipivr.core.enums.MediaConverterFormat;
import ru.sipivr.core.model.User;
import ru.sipivr.core.service.*;
import ru.sipivr.core.utils.UserException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;

/**
 * Created by Karpukhin on 01.01.2016.
 */

public abstract class BaseController {
    @Autowired(required = false)
    protected HttpServletRequest request;

    @Autowired
    protected AppConfig appConfig;
    @Autowired
    protected DaoService dao;
    @Autowired
    protected BundleService bundleService;
    @Autowired
    protected PluginService pluginService;
    @Autowired
    protected MediaConverter mediaConverter;
    @Autowired
    protected Mapper mapper;

    protected User getCurrentUser() {
        return (User)SecurityContextHolder.getContext().getAuthentication().getDetails();
    }

    protected void playMediaFile(HttpServletResponse response, String path) throws Exception {
        playMediaFile(response, new File(path));
    }

    protected void playMediaFile(HttpServletResponse response, File mediaFile) throws Exception {
        String extension = FilenameUtils.getExtension(mediaFile.getName());
        if (MediaConverterFormat.valueOf(extension.toUpperCase()) == null)
            throw new UserException("format not supported");

        if (!mediaFile.exists())
            throw new UserException("File does not exist");

        File mp3;

        if (extension.equals(MediaConverterFormat.MP3.getValue())) {
            mp3 = mediaFile;
        } else {
            mp3 = new File(mediaFile.getPath().replace("." + MediaConverterFormat.WAV.getValue(), "." + MediaConverterFormat.MP3.getValue()));

            if(!mp3.exists()) {
                mediaConverter.convert(mediaFile, mp3);
            }
        }

        response.setContentType(Files.probeContentType(mp3.toPath()));

        String rangeHeader = request.getHeader("range");

        if (rangeHeader == null) {
            response.setContentLength((int) mp3.length());

            try (InputStream is = new FileInputStream(mp3)) {
                IOUtils.copy(is, response.getOutputStream());
            }
            response.flushBuffer();
        } else {
            response.setStatus(javax.servlet.http.HttpServletResponse.SC_PARTIAL_CONTENT);

            String rangeValue = rangeHeader.substring("bytes=".length());

            long fileLength = mp3.length();
            long start, end;

            if (rangeValue.startsWith("-")) {
                end = fileLength - 1;
                start = fileLength - 1 - Long.parseLong(rangeValue.substring("-".length()));
            } else {
                String[] range = rangeValue.split("-");
                start = Long.parseLong(range[0]);
                end = range.length > 1 ? Long.parseLong(range[1])
                        : fileLength - 1;
            }
            if (end > fileLength - 1) {
                end = fileLength - 1;
            }

            if (start <= end) {
                long contentLength = end - start + 1;
                response.setHeader("Content-Length", contentLength + "");
                response.setHeader("Content-Range", "bytes " + start + "-"
                        + end + "/" + fileLength);

                try (RandomAccessFile raf = new RandomAccessFile(mp3, "r")) {
                    byte[] buffer = new byte[4096];
                    raf.seek(start);

                    int n;
                    for (; -1 != (n = raf.read(buffer)); ) {
                        response.getOutputStream().write(buffer, 0, n);
                    }
                }

                response.flushBuffer();
            }
        }
    }
}
