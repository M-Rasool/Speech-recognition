package recognition;

import org.springframework.web.bind.annotation.*;

import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;
import java.io.*;
import java.util.Base64;

@RestController
public class RecognizeController {

    @PostMapping(value = "/recognize", consumes = "application/json")
    public String recognize(@RequestBody String body) throws IOException, UnsupportedAudioFileException, InterruptedException {
        byte[] bytes = Base64.getMimeDecoder().decode(body.split(",")[1]);
        InputStream is = new ByteArrayInputStream(bytes);
        InputStream ais = AudioSystem.getAudioInputStream(is);
        RecognizeService recognizeService = new RecognizeService();
        String text = recognizeService.recognize(ais);
        System.out.println(text);
        String uiText = new String(text.getBytes(), "UTF-8");
        return uiText;
    }

}
