# TegaJS

Round issues:
- Everyone skipping doesn't reshuffle or stop at player #4
- LastTrickTaker not logging on last trick of round

Sluffing fixes:
- Make sure the shortest suit isn't the highest card of suit (eg: bot sluffed SA because it was only Spade)
- Highest of suit should not care about current trick, if the SA is played, SK is now highest but shouldn't be played on the same trick as SA