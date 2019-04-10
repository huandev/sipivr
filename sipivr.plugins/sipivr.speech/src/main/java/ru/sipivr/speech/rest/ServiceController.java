package ru.sipivr.speech.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.speech.model.YandexTts;
import ru.sipivr.speech.service.YandexTtsService;

import java.io.File;

/**yandexTtsService
 * Created by Admin on yandexTtsService27.02.2016.
 */
@RestController("ru.sipivr.speech.controller.ServiceController")
@RequestMapping("/service")
public class ServiceController extends BaseController {
    @Autowired
    private YandexTtsService yandexTtsService;

    @RequestMapping(value = "/speech/yandex/tts", method = RequestMethod.POST, produces = "text/plain")
    @ResponseBody
    public String yandexTts(@RequestBody YandexTts model) throws Exception {
        YandexTts yandexTts = yandexTtsService.get(model);
        return new File(yandexTtsService.getFolderName(), yandexTts.getFileName()).getPath();
    }
}
