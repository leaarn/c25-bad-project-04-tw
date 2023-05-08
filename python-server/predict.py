#%%
from ultralytics import YOLO

#%%
model = YOLO('yolov8n.pt', task='detect') # [detect, classify, segment]

# %%
results = model.predict(source='/Users/hinyanc/Documents/Tecky/Tecky-projects/BAD-project/c25-bad-project-04-tw/python-server/datasets/trial-img/pets001.jpg', save=False, imgsz=500, conf=0.5, show=True)

# %%
print(results[0].boxes.data) # object position [x1, y1, x2, y2, score, label]

# %%
no_of_objects = len(results[0].boxes)
print(f"Number of objects: {no_of_objects}")
result_list = []

for result in results[0].boxes:
    object = results[0].names[result.data.numpy()[0,5]]
    result_list.append(object)
    position = result.data.numpy()[0,0:4]
    print(f"[{object}] - position: {position}")
# %%
print(result_list)
