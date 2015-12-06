from bs4 import BeautifulSoup
import scrapy

from scraper.items import GameItem


class ItchioSpider(scrapy.Spider):
    name = "itchio"
    allowed_domains = ["itch.io"]
    start_urls = [
        "http://itch.io/sitemaps/games.xml",
    ]

    def parse(self, response):
        soup = BeautifulSoup(response.body)
        for game_url in soup.find_all('loc')[:10]:
            yield scrapy.Request(game_url.text, callback=self.parse_game_page)

    def parse_game_page(self, response):
        f = open('pages/%s' % response.url.split('/')[-1], 'w')
        f.write(response.body)
        f.close()

        item = GameItem()
        soup = BeautifulSoup(response.body)
        item['title'] = soup.find(class_='game_title')
        try:
            item['description'] = soup.find('meta', {'name': 'description'})['content']
        except Exception:
            pass
        item['page_link'] = response.url
        item['image_url'] = soup.find('meta', property='og:image')['content']
        yield item
