package recognition;

import com.google.gson.Gson;
import org.vosk.LibVosk;
import org.vosk.LogLevel;
import org.vosk.Model;
import org.vosk.Recognizer;

import javax.sound.sampled.*;
import java.io.*;

public class RecognizeService {
    Model model = new Model("model");
    Recognizer recognizer = new Recognizer(model, 120000);

    public String recognize(InputStream ais) throws InterruptedException, IOException, UnsupportedAudioFileException {
        String tmpResult = "";
        String tmpPartialResult = "";
        String finalResult = "";
        LibVosk.setLogLevel(LogLevel.DEBUG);

        try {
            int nbytes;
            byte[] b = new byte[4096];
            while ((nbytes = ais.read(b)) >= 0) {
                if (recognizer.acceptWaveForm(b, nbytes)) {
                    tmpResult = recognizer.getResult();
                    break;
                } else {
                    tmpPartialResult = recognizer.getPartialResult();
                }
            }

            if (!tmpResult.equals("")) {
                Result result = new Gson().fromJson(tmpResult, Result.class);
                finalResult = result.getText();
                System.out.println("result");
                System.out.println(tmpResult);
            } else {
                PartialResult partialResult = new Gson().fromJson(tmpPartialResult, PartialResult.class);
                finalResult = partialResult.getPartialResult();
                System.out.println("partial");
                System.out.println(tmpPartialResult);
            }
            System.out.println(finalResult);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return finalResult;
    }
}
