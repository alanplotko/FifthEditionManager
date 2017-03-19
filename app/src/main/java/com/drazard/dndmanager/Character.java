package com.drazard.dndmanager;

import java.util.Locale;

public class Character {
    public String firstName;
    public String lastName;
    public String race;
    public String class_;
    public int level;
    public String gender;
    public String alignment;
    public String height;
    public String weight;
    public String age;
    public int exp;
    public String background;

    /**
     * Default constructor
     */
    public Character() {}

    /**
     * Explicit constructor with first and last name
     */
    public Character(String fname, String lname) {
        this.firstName = fname;
        this.lastName = lname;
    }

    /**
     * Getter & setters
     */

    /**
     * Character description, e.g. Level 5 Sorcerer, High Elf
     */
    @Override
    public String toString() {
        String race = (this.race != null) ? this.race : "";
        String class_ = (this.class_ != null) ? this.class_ : "";
        String description = String.format(Locale.US, "Level %1$d %2$s %3$s", this.level, race,
                class_);
        return description.replaceAll("\\s+", " ").trim();
    }
}
