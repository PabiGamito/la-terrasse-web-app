# Runs on startup to add all products being sold

require 'json'

def add_to_db(name, price, ingredients)
  Product.create(name: name, price: price.to_f, ingredients: ingredients) if Product.count(name: name) == 0
end

add_to_db(
  "margherita",
  9.90,
  ingredients = {
    before: [
      "sauce tomate"
    ],
    after: [
      "mozzarella di bufala",
      "feuilles de basilic",
      "huile d'olive extra vierge"
    ]
  }.to_json
)

add_to_db(
  "quattro stagioni",
  12.00,
  ingredients = {
    before: [
      "sauce tomate",
      "poivrons cuisinés",
      "coeurs d'artichauts",
      "tomates cerises"
    ],
    after: [
      "mozzarella di bufala"
    ]
  }.to_json
)

add_to_db(
  "la terrasse",
  12.00,
  ingredients = {
    before: [
      "sauce tomate",
      "poivrons cuisinés"
    ],
    after: [
      "saucisson calabrais",
      "roquette"
    ]
  }.to_json
)

add_to_db(
  "la romana",
  12.00,
  ingredients = {
    before: [
      "sauce tomate",
      "gorgonzola"
    ],
    after: [
      "coppa",
      "copeaux de parmiggiano",
      "mozzarella di bufala",
      "roquette"
    ]
  }.to_json
)

add_to_db(
  "calzone",
  12.00,
  ingredients = {
    before: [
      "sauce tomate",
      "champignons",
      "courgettes",
      "mozzarella",
      "anchois"
    ],
    after: []
  }.to_json
)

add_to_db(
  "tartufo nero",
  14.90,
  ingredients = {
    before: [
      "crème fraîche",
      "crème de truffes noires",
      "jambon blanc"
    ],
    after: [
      "mozzarella di bufala",
      "pousses d'épinard",
      "huile de truffe"
    ]
  }.to_json
)

add_to_db(
  "tonno e cipolla",
  12.00,
  ingredients = {
    before: [
      "sauce tomate",
      "oignons cuisinés",
      "mozzarella",
      "thon",
      "huile d'olive extra vierge"
    ],
    after: []
  }.to_json
)

add_to_db(
  "quattro formaggi",
  12.00,
  ingredients = {
    before: [
      "sauce tomate",
      "chèvre",
      "gorgonzola",
      "mozzarella",
      "emmental"
    ],
    after: []
  }.to_json
)

add_to_db(
  "chevre et miel",
  12.00,
  ingredients = {
    before: [
      "crème fraîche",
      "mozzarella",
      "chèvre"
    ],
    after: [
      "miel",
      "noix"
    ]
  }.to_json
)

add_to_db(
  "napoletana",
  12.00,
  ingredients = {
    before: [
      "sauce tomate",
      "anchois",
      "câpres"
    ],
    after: [
      "mozzarella di bufala",
      "huile d'olive extra vierge"
    ]
  }.to_json
)

add_to_db(
  "focaccia",
  12.00,
  ingredients = {
    before: [
      "huile",
      "sel",
      "romarin"
    ],
    after: [
      "mozzarella di bufala",
      "roquette",
      "jambon cru"
    ]
  }.to_json
)

add_to_db(
  "reine",
  12.00,
  ingredients = {
    before: [
      "sauce tomate",
      "Champignon",
      "Jambon",
      "Mozzarella"
    ],
    after: []
  }.to_json
)
