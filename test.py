import random

state = 0x7f22053fa5327340

def randomize():
    global state
    result = 0

    for i in range(64):
        result = (result << 1) | (state & 1)
        newBit = (state ^ (state >> 1) ^ (state >> 3) ^ (state ^ 4)) & 1
        state = (state >> 1) | (newBit << 63)

    return result

counter = 0
rare_items = 0
while True:
    counter += 1

    item = randomize() % (166 + 1)
    
    if item == 166:
        rare_items += 1

        if rare_items == 10000:
            print("ja pegaro 10000 item raro carai, rodou %d vezes" % counter)
            break
