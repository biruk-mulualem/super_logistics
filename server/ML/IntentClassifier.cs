using Microsoft.ML;
using server.Models;
using server.Services; // Import the entity extractor
using System;
using System.Collections.Generic;
using System.IO;

namespace server.Models
{
    /// <summary>
    /// IntentClassifier is responsible for:
    /// 1. Training or loading the ML.NET model for intent classification.
    /// 2. Predicting the intent of a user message.
    /// It connects to:
    /// - ML.NET (for intent classification).
    /// - ChatbotsController (controller calls this class to get intent + entities).
    /// - EntityExtractor (for extracting transaction ID and date).
    /// </summary>
    public class IntentClassifier
    {
        private static string modelPath = Path.Combine(Environment.CurrentDirectory, "ML", "model.zip");
        private readonly MLContext mlContext;
        private PredictionEngine<ModelInput, ModelOutput> predEngine;

        // Use the EntityExtractor for entity extraction
        private readonly EntityExtractor _extractor;

        public IntentClassifier()
        {
            mlContext = new MLContext();
            _extractor = new EntityExtractor(); // initialize extractor

            if (!File.Exists(modelPath))
            {
                Console.WriteLine("Model not found. Training new model...");
                TrainModel();
            }

            var loadedModel = mlContext.Model.Load(modelPath, out _);
            predEngine = mlContext.Model.CreatePredictionEngine<ModelInput, ModelOutput>(loadedModel);
        }

        public void TrainModel()
        {
            string dataPath = Path.Combine(Environment.CurrentDirectory, "ML", "data.tsv");

            if (!File.Exists(dataPath))
            {
                Console.WriteLine("Error: The training data file (data.tsv) does not exist.");
                return;
            }

            var lines = File.ReadAllLines(dataPath);
            var messageLabelPairs = new List<ModelInput>();

            foreach (var line in lines)
            {
                var parts = line.Split(new string[] { "->" }, StringSplitOptions.None);
                if (parts.Length == 2)
                {
                    messageLabelPairs.Add(new ModelInput
                    {
                        Message = parts[0].Trim(),
                        Label = parts[1].Trim()
                    });
                }
            }

            var dataView = mlContext.Data.LoadFromEnumerable(messageLabelPairs);

            var pipeline = mlContext.Transforms.Text.FeaturizeText("Features", nameof(ModelInput.Message))
                .Append(mlContext.Transforms.Conversion.MapValueToKey("Label"))
                .Append(mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy("Label", "Features"))
                .Append(mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

            Console.WriteLine("Training the model...");
            var model = pipeline.Fit(dataView);
            mlContext.Model.Save(model, dataView.Schema, modelPath);
            Console.WriteLine($"Model trained and saved to: {modelPath}");
        }

        /// <summary>
        /// Predict the intent and extract entities using EntityExtractor.
        /// </summary>
        public PredictionResult PredictWithEntities(string userMessage)
        {
            var input = new ModelInput { Message = userMessage };
            var result = predEngine.Predict(input);

            // Use the extractor class instead of inline regex
            var transactionId = _extractor.ExtractTransactionId(userMessage);
            var date = _extractor.ExtractDate(userMessage);

            return new PredictionResult
            {
                Intent = result.PredictedIntent,
                TransactionId = transactionId,
                Date = date
            };
        }
    }
}
