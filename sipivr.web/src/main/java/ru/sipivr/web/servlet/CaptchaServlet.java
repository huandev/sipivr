package ru.sipivr.web.servlet;

import nl.captcha.Captcha;
import nl.captcha.backgrounds.GradiatedBackgroundProducer;
import nl.captcha.noise.CurvedLineNoiseProducer;
import nl.captcha.servlet.CaptchaServletUtil;
import nl.captcha.text.renderer.ColoredEdgesWordRenderer;
import nl.captcha.text.renderer.DefaultWordRenderer;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.util.*;

/**
 * Created by okarpukhin on 11.03.2015.
 */
public class CaptchaServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static int _width = 200;
    private static int _height = 50;

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        if(this.getInitParameter("captcha-height") != null) {
            _height = Integer.valueOf(this.getInitParameter("captcha-height")).intValue();
        }

        if(this.getInitParameter("captcha-width") != null) {
            _width = Integer.valueOf(this.getInitParameter("captcha-width")).intValue();
        }
    }

    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        java.util.List<Color> COLORS = new ArrayList<>(1);
        java.util.List<Color> BACKGROUND_COLORS = new ArrayList<>(2);
        java.util.List<Font> FONTS = new ArrayList<>(3);

        COLORS.add(new Color(0, 0, 0));

        BACKGROUND_COLORS.add(new Color(127, 127, 127));
        BACKGROUND_COLORS.add(new Color(255, 255, 255));

        FONTS.add(new Font("Geneva", 2, 48));
        FONTS.add(new Font("Courier", 1, 48));
        FONTS.add(new Font("Arial", 1, 48));

        DefaultWordRenderer wordRenderer = new DefaultWordRenderer(COLORS, FONTS);

        Captcha captcha = (new Captcha.Builder(_width, _height))
                .addText(wordRenderer)
                .gimp()
                .addBorder()
                .addNoise(new CurvedLineNoiseProducer(new Color(51, 51, 51), 3))
                .addBackground(new GradiatedBackgroundProducer(BACKGROUND_COLORS.get(0), BACKGROUND_COLORS.get(1)))
                .build();
        CaptchaServletUtil.writeImage(resp, captcha.getImage());
        req.getSession().setAttribute("simpleCaptcha", captcha);
    }
}