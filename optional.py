"""Optionale Module
"""

from math import ceil #Aufrunden

import awattargetprices
import log

class optional():
    """
    """

    def __init__(self):
        self.data={}
        self.data["et"] = {}
        self.data["et"]["get"] = {}
    
    def et_price_lower_than_limit(self):
        """ prüft, ob der aktuelle Strompreis unter der festgelegten Preisgrenze liegt.

        Return
        ------
        True: Preis liegt darunter
        False: Preis liegt darüber
        """
        try:
            if self.data["et"]["get"]["price"] <= self.data["et"]["config"]["max_price"]:
                return True
            else:
                return False
        except Exception as e:
            self.et_get_prices()
            log.exception_logging(e)
            return False

    def et_get_loading_hours(self, duration):
        """ geht die Preise der nächsten 24h durch und liefert eine Liste der Uhrzeiten, zu denen geladen werden soll

        Parameter
        ---------
        duration: float 
            benötigte Ladezeit
        
        Return
        ------
        list: Key des Dictionarys (Unix-Sekunden der günstigen Stunden)
        """
        try:
            price_list = self.data["et"]["get"]["price_list"]
            return [i[0] for i in sorted(price_list, key=lambda x: x[1])[:ceil(duration)]]
        except Exception as e:
            self.et_get_prices()
            log.exception_logging(e)
            return []

    def et_get_prices(self):
        """
        """
        try:
            if self.data["et"]["active"] == True:
                if self.data["et"]["config"]["provider"]["provider"] == "awattar":
                    awattargetprices.update_pricedata(self.data["et"]["config"]["provider"]["country"], 0)
                else:
                    log.message_debug_log("error", "Unbekannter Et-Provider.")
        except Exception as e:
            log.exception_logging(e)