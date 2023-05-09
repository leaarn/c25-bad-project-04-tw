#%%
from sanic import Sanic
from sanic.response import json
# import tensorflow as tf
# import numpy as np
from ultralytics import YOLO
import os

#%%
app = Sanic("chicken-van")

model = YOLO('yolov8n.pt', task='detect') # [detect, classify, segment]

#%%
@app.get("/file")
def callModel(request):
    #%%
    # content = request.json
    # print(content)

    image = request.args.get("newFileName")

    #%%
    link = os.path.join(os.getcwd(), '../express-server/private/usersPrivate/uploads/', image)

    print(f'filename: {link}')
    
    results = model.predict(source=link, save=False, imgsz=500, conf=0.5, show=False)

    print(results[0].boxes.data) # object position [x1, y1, x2, y2, score, label]

    no_of_objects = len(results[0].boxes)
    print(f"Number of objects: {no_of_objects}")
    result_list = []

    for result in results[0].boxes:
        object = results[0].names[result.data.numpy()[0,5]]
        result_list.append(object)
        position = result.data.numpy()[0,0:4]
        print(f"[{object}] - position: {position}")
    
    print(result_list)
    return json({ "data": result_list })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, single_process=True)