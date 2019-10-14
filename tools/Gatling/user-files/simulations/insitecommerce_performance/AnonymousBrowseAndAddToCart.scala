package insitecommerce_performance

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class AnonymousBrowseAndAddToCart extends Simulation {

  val httpProtocol = http
    .baseURL("http://host.docker.internal")
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .doNotTrackHeader("1")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0")
    .disableCaching

  val addToCartQty = Array(
    Map("qtyOrdered" -> "1"),
    Map("qtyOrdered" -> "2"),
    Map("qtyOrdered" -> "3"),
    Map("qtyOrdered" -> "4"),
    Map("qtyOrdered" -> "5")
  ).random

  val categoryDetailFeeder = jsonUrl("http://host.docker.internal/api/v1/categories/feederData?type=categoryDetail").random
  val productListFeeder = jsonUrl("http://host.docker.internal/api/v1/categories/feederData?type=productList").random
  val productDetailFeeder = jsonUrl("http://host.docker.internal/api/v1/products/feederData").random

  val scn = scenario("BrowseAndAddToCart")
    .feed(categoryDetailFeeder)
    .feed(productListFeeder)
    .feed(productDetailFeeder)
    .feed(addToCartQty)
    .exec(AnonymousRequests.firstHome)
    .pause(1)
    .exec(AnonymousRequests.categoryDetail)
    .pause(1)
    .exec(AnonymousRequests.productList)
    .pause(1)
    .exec(AnonymousRequests.productDetail)
    .pause(1)
    .exec(AnonymousRequests.addToCart)
    .pause(1)
    .exec(AnonymousRequests.cart)
    .pause(1)
    .exec(AnonymousRequests.home)

  setUp(scn.inject(rampUsers(50) over (30 seconds))).protocols(httpProtocol)
}
