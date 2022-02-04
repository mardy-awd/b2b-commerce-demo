package insitecommerce_performance

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

object AnonymousRequests {
  val headers_accept_all = Map(
    "Accept" -> "*/*")

  val headers_css = Map(
    "Accept" -> "text/css,*/*;q=0.1")

  val headers_img = Map(
    "Accept" -> "image/webp,image/apng,image/*,*/*;q=0.8")

  val headers_0 = Map(
    "Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Upgrade-Insecure-Requests" -> "1")

  val headers_1 = Map("X-Requested-With" -> "XMLHttpRequest")

  val headers_2 = Map(
    "Accept" -> "text/html",
    "X-Requested-With" -> "XMLHttpRequest")

  val headers_3 = Map(
    "Content-Type" -> "application/json;charset=utf-8",
    "X-Requested-With" -> "XMLHttpRequest")

  val headers_4 = Map(
    "Authorization" -> "Basic aXNjOjAwOUFDNDc2LUIyOEUtNEUzMy04QkFFLUI1RjEwM0ExNDJCQw==",
    "X-Requested-With" -> "XMLHttpRequest")

  val homeResources = exec(
    http("Anonymous.HomeResources.Css.Styles1")
      .get("/bundles/fileThemes/Responsive/styles1.css")
      .headers(headers_css)
      .resources(
        http("Anonymous.HomeResources.Css.Global")
          .get("/bundles/css/incontext/global.min.css")
          .headers(headers_css),
        http("Anonymous.HomeResources.Js.BodyEnd1")
          .get("/bundles/fileThemes/Responsive/bodyend1.js")
          .headers(headers_accept_all),
        http("Anonymous.HomeResources.Js.Global")
          .get("/bundles/js/incontext/global.min.js")
          .headers(headers_accept_all),
        http("Anonymous.HomeResources.Js.Richmarker")
          .get("/SystemResources/Scripts/Libraries/richMarker/0.0.0/richmarker.min.js")
          .headers(headers_accept_all),
        http("Anonymous.HomeResources.Js.AngularLocal")
          .get("/SystemResources/Scripts/Libraries/angular-i18n/1.3.15/angular-locale_en-us.js")
          .headers(headers_accept_all)
      )
  ).exec(
    http("Anonymous.HomeResources.Js.PickadateLocal")
      .get("/SystemResources/Scripts/Libraries/pickadate/3.5.0-custom/translations/en_us.js")
      .headers(headers_accept_all)
      .resources(
        http("Anonymous.HomeResources.Font.SansproRegular")
          .get("/SystemResources/Styles/Fonts/source-sans-pro/sourcesanspro-regular-webfont.woff")
          .headers(headers_accept_all),
        http("Anonymous.HomeResources.Font.SansproBold")
          .get("/SystemResources/Styles/Fonts/source-sans-pro/sourcesanspro-bold-webfont.woff")
          .headers(headers_accept_all),
        http("Anonymous.HomeResources.Font.SansproSemibold")
          .get("/SystemResources/Styles/Fonts/source-sans-pro/sourcesanspro-semibold-webfont.woff")
          .headers(headers_accept_all),
        http("Anonymous.HomeResources.Font.GoodOatmeal")
          .get("/SystemResources/Styles/Fonts/good-oatmeal-371/good-oatmeal-371.woff")
          .headers(headers_accept_all),
        http("Anonymous.HomeResources.Image.MD_NotFound")
          .get("/UserFiles/Images/Products/MD_NotFound.jpg")
          .headers(headers_img)
      )
  )

  val firstHome = exec(
    http("Anonymous.FirstHome")
      .get("/")
      .headers(headers_0)
  ).exec(
    AnonymousRequests.homeResources
  ).exec(
    http("Anonymous.FirstHome.IsAuthenticated")
      .get("/account/isauthenticated?timestamp=1513463038345")
      .headers(headers_1)
      .resources(
        http("Anonymous.FirstHome.Settings")
          .get("/api/v1/settings?auth=false")
          .headers(headers_1),
        http("Anonymous.FirstHome.Sessions.Current")
          .get("/api/v1/sessions/current")
          .headers(headers_1),
        http("Anonymous.FirstHome.Websites.Current.CrossSells")
          .get("/api/v1/websites/current/crosssells")
          .headers(headers_1),
        http("Anonymous.FirstHome.Products.TopSellers")
          .get("/api/v1/products/?expand=brand&filter=topsellers&makeBrandUrls=false&topSellersMaxResults=20")
          .headers(headers_1),
        http("Anonymous.FirstHome.Products.RecentlyViewed")
          .get("/api/v1/products/?expand=pricing,recentlyviewed,brand")
          .headers(headers_1),
        http("Anonymous.FirstHome.Carts.Current")
          .get("/api/v1/carts/current")
          .headers(headers_1),
        http("Anonymous.FirstHome.Websites.Current")
          .get("/api/v1/websites/current?expand=languages,currencies&languageId=123ed44e-9f45-e511-bbcb-534e57000000")
          .headers(headers_1)
      )
  )

  val home = exec(
    http("Anonymous.Home")
      .get("/")
      .headers(headers_2)
      .resources(
        http("Anonymous.Home.Websites.Current.CrossSells")
          .get("/api/v1/websites/current/crosssells")
          .headers(headers_1),
        http("Anonymous.Home.Products.TopSellers")
          .get("/api/v1/products/?expand=brand&filter=topsellers&makeBrandUrls=false&topSellersMaxResults=20")
          .headers(headers_1),
        http("Anonymous.Home.Products.RecentlyViewed")
          .get("/api/v1/products/?expand=pricing,recentlyviewed,brand")
          .headers(headers_1)
      )
  )

  val categoryDetail = exec(
    http("Anonymous.CategoryDetail")
      .get("${categoryUrl}")
      .headers(headers_2)
      .resources(
        http("Anonymous.CategoryDetail.CatalogPages")
          .get("/api/v1/catalogpages?path=${categoryUrl}"),
        http("Anonymous.CategoryDetail.Products.OnlyFacets")
          .get("/api/v1/products/?categoryId=${categoryId}&expand=onlyfacets&includeAlternateInventory=true&includeSuggestions=true"),
        http("Anonymous.CategoryDetail.Products")
          .get("/api/v1/products/?applyPersonalization=true&categoryId=${categoryId}&expand=pricing,attributes,facets,brand&getAllAttributeFacets=true&includeAlternateInventory=true&includeAttributes=IncludeOnProduct&includeSuggestions=true&makeBrandUrls=false&page=1&searchWithin=&sort=1"),
        http("Anonymous.CategoryDetail.Products.TopSellers")
          .get("/api/v1/products/?expand=brand&filter=topsellers&makeBrandUrls=false&topSellersCategoryIds=${categoryId}&topSellersMaxResults=20")
      )
  )

  val productList = exec(
    http("Anonymous.ProductList")
      .get("${productListUrl}")
      .headers(headers_2)
      .resources(
        http("Anonymous.ProductList.CatalogPages")
          .get("/api/v1/catalogpages?path=${productListUrl}"),
        http("Anonymous.ProductList.Products.OnlyFacets")
          .get("/api/v1/products/?categoryId=${productListId}&expand=onlyfacets&includeAlternateInventory=true&includeSuggestions=true"),
        http("Anonymous.ProductList.Products")
          .get("/api/v1/products/?applyPersonalization=true&categoryId=${productListId}&expand=pricing,attributes,facets,brand&getAllAttributeFacets=true&includeAlternateInventory=true&includeAttributes=IncludeOnProduct&includeSuggestions=true&makeBrandUrls=false&page=1&searchWithin=&sort=1"),
        http("Anonymous.ProductList.Products.TopSellers")
          .get("/api/v1/products/?expand=brand&filter=topsellers&makeBrandUrls=false&topSellersCategoryIds=${productListId}&topSellersMaxResults=20"),
        http("Anonymous.ProductList.AvailabilityByWarehousePopup")
          .get("/PartialViews/Catalog-AvailabilityByWarehousePopup")
      )
  )

  val productDetail = exec(
    http("Anonymous.ProductDetail")
      .get("${productDetailUrl}")
      .headers(headers_2)
      .resources(
        http("Anonymous.ProductDetail.CatalogPages")
          .get("/api/v1/catalogpages?path=${productDetailUrl}"),
        http("Anonymous.ProductDetail.Products")
          .get("/api/v1/products/${productDetailId}?addToRecentlyViewed=true&applyPersonalization=true&expand=documents,specifications,styledproducts,htmlcontent,attributes,crosssells,pricing,relatedproducts,brand&includeAlternateInventory=true&includeAttributes=IncludeOnProduct"),
        http("Anonymous.ProductDetail.Products.RecentlyViewed")
          .get("/api/v1/products/?expand=pricing,recentlyviewed,brand")
      )
  )

  val brands = exec(
    http("Anonymous.Brands")
      .get("/Brands")
      .headers(headers_2)
      .resources(
        http("Anonymous.Brands.BrandAlphabet")
          .get("/api/v1/brandAlphabet"),
        http("Anonymous.Brands.Brands.Page1")
          .get("/api/v1/brands?page=1&pageSize=500&select=detailPagePath,name&sort=name+asc"),
        http("Anonymous.Brands.Brands.Page2")
          .get("/api/v1/brands?page=2&pageSize=500&select=detailPagePath,name&sort=name+asc")
      )
  )

  val brandDetail = exec(
    http("Anonymous.BrandDetail")
      .get("/Brands/${brandUrl}")
      .headers(headers_2)
      .resources(
        http("Anonymous.BrandDetail.GetByPath")
          .get("/api/v1/brands/getByPath?path=%2FBrands%2F${brandUrl}"),
        http("Anonymous.BrandDetail.Categories")
          .get("/api/v1/brands/${brandId}/categories?brandId=${brandId}&maximumDepth=2&page=1&pageSize=1000&sort=name"),
        http("Anonymous.BrandDetail.ProductLines")
          .get("/api/v1/brands/${brandId}/productlines?brandId=${brandId}&getFeatured=true&page=1&pageSize=1000&sort=name"),
        http("Anonymous.BrandDetail.Products.TopSellers")
          .get("/api/v1/products/?brandIds=${brandId}&expand=brand&filter=topsellers&makeBrandUrls=true&topSellersMaxResults=10")
      )
  )

  val brandProductList = exec(
    http("Anonymous.BrandProductList.Catalog.All")
      .get("/Brands/${brandUrl}/Catalog/All")
      .headers(headers_2)
      .resources(
        http("Anonymous.BrandProductList.Catalog.All.CatalogPages")
          .get("/api/v1/catalogpages?path=%2FBrands%2F${brandUrl}%2FCatalog%2FAll"),
        http("Anonymous.BrandProductList.Catalog.All.Products")
          .get("/api/v1/products/?applyPersonalization=true&brandIds=${brandId}&expand=pricing,attributes,facets,brand&getAllAttributeFacets=true&includeAlternateInventory=true&includeAttributes=IncludeOnProduct&includeSuggestions=true&makeBrandUrls=true&page=1&searchWithin=&sort=1"),
        http("Anonymous.BrandProductList.Catalog.All.Products.TopSellers")
          .get("/api/v1/products/?brandIds=${brandId}&expand=brand&filter=topsellers&makeBrandUrls=true&topSellersMaxResults=10")
      )
  )

  val addToCart = exec(
    http("Anonymous.AddToCart")
      .post("/api/v1/carts/current/cartlines")
      .headers(headers_3)
      .body(StringBody("""{"productId":"${productDetailId}","qtyOrdered":${qtyOrdered},"unitOfMeasure":""}"""))
      .resources(
        http("Anonymous.AddToCart.AddToCartPopup")
          .get("/PartialViews/Cart-AddToCartPopup"),
        http("Anonymous.AddToCart.Carts.Current")
          .get("/api/v1/carts/current"))
  )

  val cart = exec(
    http("Anonymous.Cart")
      .get("/Cart")
      .headers(headers_2)
      .resources(
        http("Anonymous.Cart.DeliveryMethodPopup")
          .get("/PartialViews/Account-DeliveryMethod"),
        http("Anonymous.Cart.WarehouseInfoPopup")
          .get("/PartialViews/Account-WarehouseInfo"),
        http("Anonymous.Cart.Carts.Current")
          .get("/api/v1/carts/current?expand=allowInvalidAddress=true&expand=cartlines,costcodes,hiddenproducts,shipping,tax"),
        http("Anonymous.Cart.Carts.Current.Promotions")
          .get("/api/v1/carts/current/promotions"),
        http("Anonymous.Cart.Websites.Current.CrossSells")
          .get("/api/v1/websites/current/crosssells"),
        http("Anonymous.Cart.Products.RecentlyViewed")
          .get("/api/v1/products/?expand=pricing,recentlyviewed,brand"))
  )

  val signInPage = exec(
    http("Anonymous.SignInPage")
      .get("/MyAccount/SignIn")
        .headers(headers_2)
        .resources(
          http("Anonymous.SignInPage.ExternalProviders")
            .get("/identity/externalproviders")
            .headers(headers_1))
  )

  val signIn = exec(
    http("Anonymous.SignIn")
      .post("/identity/connect/token")
      .headers(headers_4)
        .formParam("grant_type", "password")
        .formParam("username", "${userName}")
        .formParam("password", "Password1")
        .formParam("scope", "iscapi offline_access")
        .basicAuth("isc","009AC476-B28E-4E33-8BAE-B5F103A142BC")
          .check(status is 200)
          .check(jsonPath("$.access_token").saveAs("bearerToken"))
 )

  val createAccountPage = exec(
    http("Anonymous.CreateAccountPage")
      .get("/MyAccount/CreateAccount")
      .headers(headers_2)
  )

  val createAccount = exec(
    http("Anonymous.CreateAccount")
      .post("/api/v1/accounts")
      .headers(headers_3)
      .body(StringBody("""{"email":"${userName}@test.com","userName":"${userName}","password":"Password1"}"""))
  )
}
