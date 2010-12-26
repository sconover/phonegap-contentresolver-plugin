package com.phonegap;

import android.database.Cursor;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;
import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class ContentResolverQuery extends Plugin {

  public PluginResult execute(String action, JSONArray args, String callbackId) {
    try {
      JSONObject jsonArgs = args.getJSONObject(0);
      JSONArray results = query(jsonArgs);
      debugLog("returning " + String.valueOf(results.length()) + " results");
      return new PluginResult(PluginResult.Status.OK, results);
    } catch (JSONException jex) {
      throw new RuntimeException(jex); //doing the needful with checked exception spam
    } catch (RuntimeException rex) {
      return new PluginResult(PluginResult.Status.ERROR, rex.getMessage());
    }
  }

  public JSONArray query(JSONObject args) throws JSONException {
    String order = "";

    if (args.has("order")) {
      order += args.getString("order");
    } else {
      order += "rowid ASC";
    }
    if (args.has("limit")) { order += " limit " + args.getString("limit"); }

    logQuery(args, order);

    Cursor cursor = this.ctx.getContentResolver().query(
                                                         Uri.parse(args.getString("uri")),
                                                         args.has("projection") ? convertJSONArrayToStringArray(args.getJSONObject("projection").names()) : null,
                                                         args.has("selection") ? args.getString("selection") : null,
                                                         args.has("selectionArgs") ? convertJSONArrayToStringArray(args.getJSONArray("selectionArgs")) : null,
                                                         order
    );

    return convertCursorResultsToJson(cursor, args.has("projection") ? args.getJSONObject("projection") : null);
  }

  private void logQuery(JSONObject args, String order) throws JSONException {
    StringBuffer sb = new StringBuffer();
    sb.append("uri: ");
    sb.append(args.has("uri") ? args.getString("uri") : "null");
    sb.append(" projection: ");
    sb.append(args.has("projection") ? TextUtils.join(", ", convertJSONArrayToStringArray(args.getJSONObject("projection").names())) : "null");
    sb.append(" selection: ");
    sb.append(args.has("selection") ? args.getString("selection") : "null");
    sb.append(" selectionArgs: ");
    sb.append(args.has("selectionArgs") ? TextUtils.join(", ", convertJSONArrayToStringArray(args.getJSONArray("selectionArgs"))) : "null");
    sb.append(" order/limit: ");
    sb.append(order);
    String logLine = sb.toString();
    debugLog(logLine);
  }

  private void debugLog(String logLine) {
    Log.d("phonegapPlugin:ContentResolverQuery", logLine);
  }

  private String[] convertJSONArrayToStringArray(JSONArray jsonArray) throws JSONException {
    String[] stringArray = new String[jsonArray.length()];
    for (int i=0; i<jsonArray.length(); i++){stringArray[i] = jsonArray.getString(i);}
    return stringArray;
  }

  private JSONArray convertCursorResultsToJson(Cursor cursor, JSONObject projection) throws JSONException {
    JSONArray records = new JSONArray();

    try {
      while (cursor.moveToNext()) {
        JSONObject record = new JSONObject();

        if (projection == null) {
          populateRecordWithAllColumnsAsStrings(cursor, record);
        } else {
          populateRecordWithProjectionColumnsAppropriatelyTyped(cursor, projection, record);
        }
        records.put(record);

      }
    } finally {
      cursor.close();
    }

    return records;
  }

  private void populateRecordWithAllColumnsAsStrings(Cursor cursor, JSONObject record) throws JSONException {
    for(int columnIndex=0; columnIndex<cursor.getColumnCount(); columnIndex++) {
      String columnName = cursor.getColumnName(columnIndex);
      String value = cursor.getString(columnIndex);

      String camelizedColumnName = lowerCamelize(columnName);

      record.put(camelizedColumnName, value);
    }
  }

  private void populateRecordWithProjectionColumnsAppropriatelyTyped(Cursor cursor, JSONObject projection, JSONObject record) throws JSONException {
    Iterator keys = projection.keys();
    while(keys.hasNext()) {
      String columnName = (String)keys.next();
      String expectedType = (String)projection.get(columnName);
      int columnIndex = cursor.getColumnIndex(columnName);

      Object value = null;
      if (expectedType.equals("int")) {
        value = cursor.getInt(columnIndex);
      } else if (expectedType.equals("float")) {
        value = cursor.getFloat(columnIndex);
      } else if (expectedType.equals("long")) {
        value = cursor.getLong(columnIndex);
      } else {
        value = cursor.getString(columnIndex);
      }

      String camelizedColumnName = lowerCamelize(columnName);

      record.put(camelizedColumnName, value);
    }
  }


  private static Map lowerUnderscoreToLowerCamel = new HashMap();

  private String lowerCamelize(String lowerUnderscore) {
    if (lowerUnderscoreToLowerCamel.containsKey(lowerUnderscore)) {
      return (String) lowerUnderscoreToLowerCamel.get(lowerUnderscore);
    }

    String[] parts = TextUtils.split(lowerUnderscore, "_");
    StringBuffer sb = new StringBuffer();
    if (parts.length==1){
      return lowerUnderscore;
    }

    boolean afterFirstPart = false;
    for(int i=0; i<parts.length; i++) {
      String part = parts[i];
      if (!part.equals("")) {
        if (afterFirstPart) {
          String firstLetter = TextUtils.substring(part, 0, 1);
          String remaining = TextUtils.substring(part, 1, part.length());
          sb.append(firstLetter.toUpperCase());
          sb.append(remaining.toLowerCase());
        } else {
          sb.append(part.toLowerCase());
          afterFirstPart = true;
        }
      }
    }

    String result = sb.toString();
    if (parts[0].equals("")) {
      result = "_" + result;
    }

    lowerUnderscoreToLowerCamel.put(lowerUnderscore, result);

    return result;
  }


}
