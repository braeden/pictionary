const hardWords = {
    "words": ["atlas", "welder", "taxes", "cargo", "baguette", "freshman", "scuba diving", "braid", "hurdle", "hand soap", "prime meridian", "captain", "quadrant", "cleaning spray", "bruise", "gas station", "wheelie", "hovercraft", "best friend", "fortress", "sword swallower", "swamp", "fade", "migrate", "drip", "shampoo", "plastic", "stage fright", "vehicle", "deep", "jaw", "hospital", "log-in", "gold", "albatross", "macaroni", "postcard", "sun block", "carnival", "hoop", "pro", "driveway", "imagine", "jigsaw", "dust bunny", "junk", "spaceship", "spare", "headache", "tourist", "trapped", "print", "ratchet", "chess", "saddle", "laundry detergent", "lunch tray", "rib", "shower curtain", "distance", "economics", "gallon", "record", "comfy", "coworker", "chain mail", "twist", "vacation", "cherub", "cloak", "car dealership", "shrink ray", "stay", "hot tub", "song", "wobble", "diver", "propose", "ski goggles", "hut", "exercise", "midnight", "half", "boa constrictor", "eraser", "beanstalk", "zipper", "vegetarian", "traffic jam", "yard", "cruise", "molar", "humidity", "chestnut", "thaw", "dryer sheets", "ringleader", "fabric", "glue stick", "robe", "grasslands", "gasoline", "tide", "quit", "parking garage", "sash", "heater", "cubicle", "landlord", "son-in-law", "plank", "quartz", "pail", "toll road", "drain", "glitter", "biscuit", "dizzy", "living room", "lace", "script", "brand", "whisk", "speakers", "juggle", "passenger", "cough", "police", "student", "sticky note", "lumberyard", "vanilla", "toddler", "thunder", "pharmacist", "bleach", "clown", "dripping", "cliff diving", "expert", "wag", "correct", "recess", "aircraft carrier", "landscape", "injury", "Jedi", "beluga whale", "water cycle", "toolbox", "flu", "human", "learn", "catalog", "cousin", "taxi", "applause", "cartoon", "coastline", "ruby", "yawn", "shack", "bobsled", "dance", "dorsal", "cliff", "geyser", "stationery", "apathetic", "foil", "suit", "homework", "delivery", "compare", "toy store", "pickup truck", "company", "density", "cushion", "pawn", "wind", "great-grandfather", "aunt", "ornament", "taxidermist", "germ", "chisel", "moth", "roller coaster", "vet", "dentist", "wedding cake", "cardboard", "putty", "raft", "mysterious", "pet store", "peace", "cape", "edit", "testify", "baseboards", "banister", "miner", "elope", "download", "soak", "sweater vest", "science", "first class", "clique", "crop duster", "deliver", "cell phone charger", "rodeo", "drill bit", "ticket", "receipt", "right", "swarm", "ping pong", "\u00c3\u00af\u00c2\u00bb\u00c2\u00bfaccounting", "school", "time machine", "password", "icicle", "boulevard", "carpenter", "balance beam", "rhythm", "drawback", "ginger", "skating rink", "actor", "hour", "wooly mammoth", "startup", "snag", "yak", "bulldog", "darts", "orbit", "cot", "dream", "mine", "tow truck", "swoop", "border", "cruise ship", "fresh water", "mirror", "printer ink", "fog", "diagonal", "electrical outlet", "hang glider", "pile", "punk", "mascot", "crow's nest", "sandpaper", "think", "violent", "crime", "wax", "birthday", "blizzard", "neighborhood", "hermit crab", "season", "sleep", "CD", "cable car", "ski lift", "mold", "chicken coop", "gown", "eighteen-wheeler", "pigpen", "ditch", "runoff", "salmon", "runt", "arcade", "stuffed animal", "poison", "chemical", "RV", "roommate", "important", "scuff mark", "dew", "letter opener", "sap", "date", "telephone booth", "factory", "end zone", "lullaby", "leak", "van", "cattle", "degree", "nightmare", "clog", "avocado", "s'mores", "truck stop", "Quidditch", "irrigation", "grandpa", "ivy", "rim", "oxcart", "puppet", "hipster", "ream", "engaged", "carat", "myth", "post office", "weather", "tackle", "manatee", "competition", "yardstick", "limit", "cockpit", "partner", "cure", "dashboard", "sheep dog", "calm", "lunar rover", "shelter", "rind", "lance", "rubber", "hairspray", "black belt", "baggage", "tin", "airport security", "vanish", "drought", "trombone", "dodgeball", "publisher", "drugstore", "chariot", "parade", "wrap", "sunburn", "plow", "newsletter", "tank", "sandbox", "goblin", "coach", "photosynthesis", "somersault", "surround", "fizz", "Heinz 57", "earthquake", "snore", "mast", "goalkeeper", "hail", "gold medal", "costume", "double", "yacht", "boxing", "classroom", "snarl", "government", "husband", "vitamin", "blueprint", "dent", "foam", "tag", "yolk", "tiptoe", "fiance", "cream", "kneel", "centimeter", "idea", "obey", "pain", "houseboat", "scream", "reservoir", "crane", "rudder", "chairman", "attack", "pizza sauce", "tip", "sunrise", "picnic", "character", "last", "prey", "garden hose", "carpet", "disc jockey", "cheat", "yodel", "level", "tablespoon", "connection", "art gallery", "story", "sweater", "judge", "devious", "university", "crust", "baby-sitter", "invent", "guarantee", "swing dancing", "lap", "amusement park", "professor", "handle", "plumber", "musician", "cello", "wallow", "palace", "nanny", "acrobat", "firefighter", "zoom", "flock", "clamp", "sponge", "toothpaste", "jeans", "optometrist", "bookend", "commercial", "team", "movie", "elf", "edge", "omnivore", "stew", "fireside", "tearful", "pilot", "bedbug", "gumball", "leather", "mat", "glue gun", "interception", "servant", "laser", "macho", "page", "hydrogen", "wool", "world", "fast food", "point", "sugar", "geologist", "fireman pole", "ounce", "trip", "extension cord", "pocket", "country", "check", "front", "retail", "athlete", "president", "time", "honk", "parent", "loveseat", "win", "thief", "peasant", "jazz", "produce", "chef", "logo", "caviar", "koala", "stage", "washing machine", "blush", "quicksand", "cuckoo clock", "steam", "cheerleader", "customer", "religion", "seat", "volleyball", "zoo", "recycle", "oar", "darkness", "pharaoh", "downpour", "frost", "bargain", "stutter", "torch", "stow", "conveyor belt", "concession stand", "stopwatch", "mayor", "wig", "prize", "lung", "florist", "videogame", "haircut", "chariot racing", "shrew", "advertisement", "dawn", "snooze", "full", "bald", "flavor", "bonnet", "golf cart", "tugboat", "vein", "organ", "trail", "groom", "nap", "thrift store", "lie", "bookstore", "crate", "plantation", "staple", "mime", "bride", "dress shirt", "chameleon", "fiddle", "softball", "back flip", "water buffalo", "pest", "cabin", "jungle", "tow", "reveal", "lecture", "knight", "coil", "dead end", "signal", "chime", "monsoon", "drive-through", "ceiling fan", "cellar", "sneeze", "safe", "grocery store", "fur", "lipstick", "sushi", "barbershop", "turtleneck", "synchronized swimming", "owner", "ashamed", "earache", "sled", "cowboy", "Internet", "stadium", "barber", "rut"]
} // source: https://www.thegamegal.com/word-generator/

export {
    hardWords
}