/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package kpbn.app;

import kpbn.list.LinkedList;

import static kpbn.utilities.StringUtils.join;
import static kpbn.utilities.StringUtils.split;
import static kpbn.app.MessageUtils.getMessage;

import org.apache.commons.text.WordUtils;

public class App {
    public static void main(String[] args) {
        LinkedList tokens;
        tokens = split(getMessage());
        String result = join(tokens);
        System.out.println(WordUtils.capitalize(result));
    }
}
