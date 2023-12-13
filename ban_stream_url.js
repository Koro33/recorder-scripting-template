recorderEvents = {
  onFetchStreamUrl(data) {
    const playUrl = fetchSync(
      `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${data.roomid}&qn=10000&platform=web`,
      {
        method: "GET",
        headers: {
          Origin: "https://live.bilibili.com",
          Referer: "https://live.bilibili.com/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
        },
      }
    );

    if (!playUrl.ok) {
      return null;
    }

    /** @type {string[]?} */
    const urls = JSON.parse(playUrl.body)?.data.durl?.map((x) => x.url);

    if (!urls?.length) return null;

    // filter out `d1--ov-gotcha07.bilivideo.com`
    const matchGotcha =
      /^https?\:\/\/[^\/]*gotcha07[^\/]*\.bilivideo\.com\/.+$/;

    const filtered = urls.filter((x) => {
      var is_gotcha07 = matchGotcha.test(x);
      if (is_gotcha07) {
        console.warn("Filtered Url: " + x);
      }
      return !is_gotcha07;
    });

    if (filtered.length) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    } else {
      return urls[Math.floor(Math.random() * urls.length)];
    }
  },
};

//ref: https://rec.danmuji.org/reference/userscript/
