#%%
from ultralytics import YOLO

model = YOLO('yolov8n.pt') # pass any model type
model.info() 
model.train(data='coco128.yaml', epochs=3, imgsz=640)
metrics = model.val()  # evaluate model performance on the validation set

#%%
model.export(format='saved_model', keras=True)

#%%
image_path = 'Baby+Animals.jpg'
results = model(image_path)  # predict on an image

#%%
print(results[0].probs)
# model.summary()
## Save the model which can be loaded later.
# model.save('./model', overwrite=True); # tensorflow format

# %%

import cv2
#%%
res_plotted = results[0].plot()

#%%
cv2.imshow("result-testing", res_plotted)

# %%
import tensorflow as tf
model_path = '/Users/hinyanc/Documents/Tecky/Tecky-projects/BAD-project/c25-bad-project-04-tw/runs/detect/train5/weights/best_saved_model'
image = cv2.imread('Baby+Animals.jpg')
model2 = tf.saved_model.load(model_path)
image_tensor = tf.convert_to_tensor(image, dtype=tf.float32)
result2 = model2(image_tensor, training=False)
print(result2)
# %%
