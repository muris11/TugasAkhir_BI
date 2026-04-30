# Kode Python Minggu 3 dan Minggu 4 — BI Kelompok 3

Isi package:

1. `Kode_Python_Minggu_3_ETL_Data_Warehouse.ipynb`
   - Load dataset inti
   - Audit missing value
   - ETL: cleaning, validasi, surrogate key
   - Membuat dimension table, fact table, data mart
   - Membuat `data_ready_analisis_2024.csv`
   - Membuat visualisasi audit, alur ETL, dan star schema

2. `Kode_Python_Minggu_4_Data_Mining.ipynb`
   - Load `data_ready_analisis_2024.csv`
   - Statistik deskriptif dan korelasi
   - Standardisasi fitur
   - K-Means clustering k=2 sampai k=6
   - Evaluasi silhouette score dan inertia
   - Cluster final k=3
   - Skor prioritas wilayah
   - Output CSV dan PNG data mining

Urutan menjalankan:

1. Jalankan notebook Minggu 3 terlebih dahulu.
2. Jalankan notebook Minggu 4 setelah folder `data_siap_dw` tersedia.

Library utama:

- pandas
- numpy
- matplotlib
- scikit-learn

Catatan:
Notebook sudah dibuat fleksibel agar bisa dijalankan dari folder package ini. File input utama `jabar_week1_dataset_inti_27kabkota.csv` sudah disertakan.
