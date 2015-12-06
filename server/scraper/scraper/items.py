# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy

from scrapy_djangoitem import DjangoItem


class GameItem(DjangoItem):
    title = scrapy.Field()
    description = scrapy.Field()
    page_link = scrapy.Field()
    data_upload_id = scrapy.Field()
    image_url = scrapy.Field()
