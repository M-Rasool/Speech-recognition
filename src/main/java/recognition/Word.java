package recognition;

public class Word {
    private double conf;
    private double end;
    private double start;
    private String word;

    public Word() {
    }

    public Word(double conf, double end, double start, String word) {
        this.conf = conf;
        this.end = end;
        this.start = start;
        this.word = word;
    }

    public double getConf() {
        return conf;
    }

    public void setConf(double conf) {
        this.conf = conf;
    }

    public double getEnd() {
        return end;
    }

    public void setEnd(double end) {
        this.end = end;
    }

    public double getStart() {
        return start;
    }

    public void setStart(double start) {
        this.start = start;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }
}
