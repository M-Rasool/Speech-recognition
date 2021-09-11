package recognition;

import org.springframework.web.bind.annotation.*;

@RestController
public class RestApi {

    @GetMapping(value = "/getUrl")
    public String getUrl(@RequestParam(name = "text") String text) {
        System.out.println(text);
        switch (text) {
            case "تقویم آموزشی":
                return "https://yazd.ac.ir/offices/educational/home/calendar";
            case "معاونت اداری و مالی":
                return "https://yazd.ac.ir/offices/financial/home/introduction";
            case "گوگل":
                return "http://google.com";
            default:
                return "https://yazd.ac.ir/module/SiteSearch/SearchResult/page-7697/SearchResult.aspx?QueryExpr=" + text + "&ResultsPage=1";
        }
    }
}
