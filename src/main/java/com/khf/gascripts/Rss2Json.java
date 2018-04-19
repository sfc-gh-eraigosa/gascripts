/*
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.khf.gascripts;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.json.XML;
import java.net.URL;
import java.net.URLConnection;
import java.io.BufferedReader;
import java.io.InputStreamReader;

// [START simple_request_example]
// With @WebServlet annotation the webapp/WEB-INF/web.xml is no longer required.
@WebServlet(name = "rss2json", description = "RSS 2 JSON", urlPatterns = "/rss2json")
public class Rss2Json extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    try {
      System.setProperty("java.net.preferIPv4Stack", "true");
      resp.setContentType("text/json");
      String rss_url = new String(req.getParameter("rss_url").toString().getBytes("UTF-8"),"ASCII");
      // String xml = getText("https://sites.google.com/site/thekyronhormanfoundation/missing-children---banners/posts.xml");
      String xml = getText(rss_url);
      JSONObject jObject = XML.toJSONObject(xml);
      String json = jObject.toString();
      resp.setHeader("Access-Control-Allow-Origin", "*");
      resp.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS");
      resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
      resp.getWriter().println(json);
    } catch (Exception e) {
      throw new IOException(e);
    }
  }

  public static String getText(String url) throws Exception {
    URL website = new URL(url);
    URLConnection connection = website.openConnection();
    BufferedReader in = new BufferedReader(
                          new InputStreamReader(
                            connection.getInputStream()
                          )
                        );

    StringBuilder response = new StringBuilder();
    String inputLine;

    while ((inputLine = in.readLine()) != null)
      response.append(inputLine);

    in.close();

    return response.toString();
  }
}
// [END simple_request_example]
