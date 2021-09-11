package recognition;

import java.util.List;

public class Result {
    private List<Word> result;
    private String text;

    public Result() {
    }

    public Result(List<Word> result, String text) {
        this.result = result;
        this.text = text;
    }

    public List<Word> getResult() {
        return result;
    }

    public void setResult(List<Word> result) {
        this.result = result;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
