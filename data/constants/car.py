import logging

logger = logging.getLogger(__name__)

cars = {
  21: "Backfire",
  22: "Breakout",
  23: "Octane",
  24: "Paladin",
  25: "Roadhog",
  26: "Gizmo",
  27: "Sweet Tooth",
  28: "X-Devil",
  29: "Hotshot",
  30: "Merc",
  31: "Venom",
  402: "Takumi",
  403: "Dominus",
  404: "Scarab",
  523: "Zippy",
  597: "Delorean",
  600: "Ripper",
  607: "Grog",
  625: "Armadillo",
  723: "Hogsticker",
  803: "'16 Batmobile",
  1018: "Dominus GT",
  1159: "X-Devil Mk2",
  1171: "Masamune",
  1172: "Marauder",
  1286: "Aftershock",
  1295: "Takumi RX-T",
  1300: "Roadhog XL",
  1317: "Esper",
  1416: "Breakout Type-S",
  1475: "Proteus",
  1478: "Triton",
  1533: "Vulcan",
  1568: "Octane ZSR",
  1603: "Twinmill III",
  1623: "Bone Shaker",
  1624: "Endo",
  1675: "Ice Charger",
  1691: "Mantis",
  1856: "Jager 619",
  1883: "Imperator DT5",
  1919: "Centio V17",
  1932: "Animus GP",
  2070: "Werewolf",
  2268: "Dodge Charger R/T",
  2269: "Skyline GT-R",
  2298: "Samus' Gunship",
  2313: "Mario NSR",
  2665: "TDK Tumbler",
  2666: "'89 Batmobile",
  2853: "Twinzer",
  2919: "Jurassic Jeep Wrangler",
  3031: "Cyclone",
  3155: "Maverick",
  3156: "Maverick G1",
  3157: "Maverick GXT",
  3265: "McLaren 570S",
  3426: "Diestro",
  3451: "Nimbus",
  3594: "Artemis G1",
  3614: "Artemis",
  3622: "Artemis GXT",
  3875: "Guardian GXT",
  3879: "Guardian",
  3880: "Guardian G1"
}


def get_car(index: int) -> str:
    try:
        return cars[index]
    except KeyError:
        logger.warning(f"Could not find car: {index}.")
        return "Unknown"
