package com.drazard.ddmanager;

public class Character {
    String _fname;
    String _lname;
    String _class;

    /**
     * Default constructor
     */
    public Character() {}

    /**
     * Explicit constructor
     */
    public Character(String fname, String lname) {
        this._fname = fname;
        this._lname = lname;
    }

    /**
     * Getter & setter for character name (full and separate components)
     */
    public String getFullName() {
        return this._fname + " " + this._lname;
    }

    public String getFirstName() {
        return this._fname;
    }
    public void setFirstName(String fname) {
        this._fname = fname;
    }

    public String getLastName() {
        return this._lname;
    }
    public void setLastName(String lname) {
        this._lname = lname;
    }

    /**
     * Getter & setter for character class
     */
    public String getCharacterClass() {
        return this._class;
    }
    public void setCharacterClass(String newClass) {
        this._class = newClass;
    }

    /**
     * Character description, e.g. Level 5 Sorcerer, High Elf
     */
    @Override
    public String toString() {
        return "Character Description Here";
    }
}
