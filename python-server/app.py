from sanic import Sanic
from sanic.response import json
import tensorflow as tf
import numpy as np

class_names = ['bird', 'cat', 'dog', 'horse', 'elephant', 'bear', 'zebra', 'giraffe']

app = Sanic("Python-Hosted-Model")

model = tf.saved_model.load('./')

@app.post("/")
def callModel(request):
    content = request.json

    predict_dataset = tf.convert_to_tensor(content)

    predictions = model(predict_dataset, training=False)
    probs = tf.nn.softmax(predictions)

    class_indexes = tf.argmax(probs, axis = 1).numpy()
    results = []

    for i, class_idx in enumerate(class_indexes):
        name = class_names[class_idx]
        p = np.max(probs[i].numpy())
        results.append({
            "name": name,
            "probability": float(p)
        })

    return json({ "data": results })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, single_process=True)