package com.drazard.dndmanager;

public class Character {
    private String fname;
    private String lname;
    private String race;
    private String _class;
    private String gender;
    private String alignment;
    private String height;
    private String weight;
    private String age;
    private int exp;

    /**
     * Default constructor
     */
    public Character() {}

    /**
     * Explicit constructor with first and last name
     */
    public Character(String fnameIn, String lnameIn) {
        this.fname = fnameIn;
        this.lname = lnameIn;
    }

    /**
     * Getter & setters
     */

    // Get full name
    public String getFullName() {
        return this.fname + " " + this.lname;
    }

    public String getFirstName() {
        return this.fname;
    }
    public void setFirstName(String fnameIn) {
        this.fname = fnameIn;
    }

    public String getLastName() {
        return this.lname;
    }
    public void setLastName(String lnameIn) {
        this.lname = lnameIn;
    }

    public String getCharacterRace() { return this.race; }
    public void setCharacterRace(String raceIn) { this.race = raceIn; }

    public String getCharacterClass() {
        return this._class;
    }
    public void setCharacterClass(String classIn) {
        this._class = classIn;
    }

    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getExp() {
        return exp;
    }
    public void setExp(int exp) {
        this.exp = exp;
    }

    public String getWeight() {
        return weight;
    }
    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getAge() {
        return age;
    }
    public void setAge(String age) {
        this.age = age;
    }

    public String getHeight() {
        return height;
    }
    public void setHeight(String height) {
        this.height = height;
    }

    public String getAlignment() {
        return alignment;
    }
    public void setAlignment(String alignment) {
        this.alignment = alignment;
    }

    /**
     * Character description, e.g. Level 5 Sorcerer, High Elf
     */
    @Override
    public String toString() {
        return "Character Description Here";
    }
}
