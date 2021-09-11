package recognition;

import javax.sound.sampled.*;
import java.io.File;
import java.io.IOException;

public class Voice {
    public void get() {
        System.out.println("starting test audio ...");
        try {
            AudioFormat format = new AudioFormat(AudioFormat.Encoding.PCM_SIGNED, 60000, 16, 2, 4, 44100, false);
            DataLine.Info info = new DataLine.Info(TargetDataLine.class, format);
            if (!AudioSystem.isLineSupported(info))
                System.err.println("line not supported");

            final TargetDataLine dataLine = (TargetDataLine) AudioSystem.getLine(info);
            dataLine.open();

            System.out.println("start recording ...");
            dataLine.start();

            Thread thread = new Thread() {
                @Override
                public void run() {
                    AudioInputStream inputStream = new AudioInputStream(dataLine);
                    File file = new File("record.wav");
                    try {
                        AudioSystem.write(inputStream, AudioFileFormat.Type.WAVE, file);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                    System.out.println("stopped recording");

                }
            };

            thread.start();
            Thread.sleep(5000);
            dataLine.stop();
            dataLine.close();

            System.out.println("ended sound test");
        } catch (LineUnavailableException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }
}
