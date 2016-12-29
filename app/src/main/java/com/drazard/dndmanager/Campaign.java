package com.drazard.dndmanager;

import android.database.Cursor;
import android.text.format.DateUtils;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Campaign {
    int _id;
    long _created_at, _updated_at;
    Character _character;

    /**
     * Default constructor
     */
    public Campaign() {}

    /**
     * Reconstruct campaign from DB
     */
    public Campaign(Cursor cursor) {
        this._id = Integer.parseInt(cursor.getString(0));
        this._created_at = Timestamp.valueOf(cursor.getString(1)).getTime();
        this._updated_at = Timestamp.valueOf(cursor.getString(2)).getTime();
        this._character = new Character();
        this._character.setFirstName(cursor.getString(3));
        this._character.setLastName(cursor.getString(4));
        this._character.setCharacterClass(cursor.getString(5));
    }

    /**
     * Getter & setter for ID
     */
    public int getID() {
        return this._id;
    }

    public void setID(int id) {
        this._id = id;
    }

    /**
     * Getter & setter for creation and update times
     */
    public long getRawStartDate() {
        return this._created_at;
    }

    public void setRawStartDate(long t) {
        this._created_at = t;
    }

    public long getRawUpdateDate() {
        return this._updated_at;
    }

    public void setRawUpdateTime(long t) {
        this._updated_at = t;
    }

    public String getStartDate() {
        Date date = new Date(this._created_at);
        DateFormat formatter = new SimpleDateFormat("M. D, yy");
        return "Started on " + formatter.format(date);
    }

    public String getRelativeTime() {
        long now = System.currentTimeMillis();
        return "Last updated " + DateUtils.getRelativeTimeSpanString(this._updated_at, now,
                DateUtils.SECOND_IN_MILLIS).toString();
    }

    /**
     * Getter & setter for character
     */
    public Character getCharacter() {
        return this._character;
    }

    public void setCharacter(Character character) {
        this._character = character;
    }
}
