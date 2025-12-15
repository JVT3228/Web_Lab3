#!/usr/bin/env python3
"""Инициализация базы данных и загрузка тестовых данных"""

import os
import sys
import json
from pathlib import Path

# Добавляем backend в path
sys.path.insert(0, str(Path(__file__).parent.parent / 'backend'))

# Установим переменные окружения (по умолчанию для локального тестирования)
os.environ.setdefault('DB_HOST', 'localhost')
os.environ.setdefault('DB_PORT', '5432')
os.environ.setdefault('DB_NAME', 'befree_shop')
os.environ.setdefault('DB_USER', 'postgres')
os.environ.setdefault('DB_PASSWORD', 'postgres')

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("❌ psycopg2 не установлен. Установите: pip install psycopg2-binary")
    sys.exit(1)

def get_db_connection():
    """Подключение к БД"""
    return psycopg2.connect(
        host=os.environ.get('DB_HOST'),
        port=os.environ.get('DB_PORT'),
        database=os.environ.get('DB_NAME'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD')
    )

def read_sql_file(filename):
    """Чтение SQL файла"""
    path = Path(__file__).parent / filename
    return path.read_text(encoding='utf-8')

def init_schema():
    """Создание схемы БД"""
    print("📝 Создание схемы БД...")
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        schema_sql = read_sql_file('schema.sql')
        cur.execute(schema_sql)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Схема БД создана успешно")
        return True
    except psycopg2.OperationalError as e:
        print(f"❌ Ошибка подключения: {e}")
        print("   Убедитесь, что PostgreSQL запущен и БД 'befree_shop' существует")
        return False
    except Exception as e:
        print(f"❌ Ошибка при создании схемы: {e}")
        return False

def load_seed_data():
    """Загрузка тестовых данных"""
    print("🌱 Загрузка тестовых данных...")
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        seed_sql = read_sql_file('seed.sql')
        cur.execute(seed_sql)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Тестовые данные загружены успешно")
        return True
    except Exception as e:
        print(f"❌ Ошибка при загрузке данных: {e}")
        return False

def add_test_products():
    """Добавление тестовых товаров"""
    print("🛍️  Добавление тестовых товаров...")
    
    test_products = [
        {
            "name": "Черная футболка с котом",
            "description": "Уютная черная футболка со смешным новогодним котом. Идеально для праздничного сезона!",
            "price": 799,
            "category": "clothing",
            "images": ["https://via.placeholder.com/300x300?text=Black+Cat+Shirt+1", "https://via.placeholder.com/300x300?text=Black+Cat+Shirt+2"],
            "characteristics": {"Материал": "100% хлопок", "Размеры": "XS-XXL", "Цвет": "Черный"},
            "stock_quantity": 25
        },
        {
            "name": "Красный свитер с оленями",
            "description": "Праздничный свитер с изображением оленей. Теплый и комфортный.",
            "price": 1299,
            "category": "clothing",
            "images": ["https://via.placeholder.com/300x300?text=Red+Deer+Sweater"],
            "characteristics": {"Материал": "Акрил 80%, Шерсть 20%", "Размеры": "XS-XXL", "Цвет": "Красный"},
            "stock_quantity": 15
        },
        {
            "name": "Кроссовки спортивные белые",
            "description": "Удобные кроссовки для ежедневной носки. Легкие и стильные.",
            "price": 2499,
            "category": "footwear",
            "images": ["https://via.placeholder.com/300x300?text=White+Sneakers+1", "https://via.placeholder.com/300x300?text=White+Sneakers+2"],
            "characteristics": {"Материал": "Текстиль, Резина", "Размеры": "36-45", "Цвет": "Белый"},
            "stock_quantity": 30
        },
        {
            "name": "Кеды черные классические",
            "description": "Классические черные кеды. Универсальны для любого стиля.",
            "price": 1899,
            "category": "footwear",
            "images": ["https://via.placeholder.com/300x300?text=Black+Sneakers"],
            "characteristics": {"Материал": "Текстиль, Резина", "Размеры": "36-45", "Цвет": "Черный"},
            "stock_quantity": 40
        },
        {
            "name": "Зимняя шапка бежевая",
            "description": "Теплая шапка из мягкой пряжи. Идеальна для холодных дней.",
            "price": 599,
            "category": "accessories",
            "images": ["https://via.placeholder.com/300x300?text=Beige+Winter+Hat"],
            "characteristics": {"Материал": "Акрил 100%", "Размер": "Универсальный", "Цвет": "Бежевый"},
            "stock_quantity": 50
        },
        {
            "name": "Шарф теплый серый",
            "description": "Мягкий и теплый шарф. Отлично дополнит любой зимний образ.",
            "price": 799,
            "category": "accessories",
            "images": ["https://via.placeholder.com/300x300?text=Gray+Warm+Scarf"],
            "characteristics": {"Материал": "Шерсть 100%", "Длина": "180см", "Цвет": "Серый"},
            "stock_quantity": 35
        },
        {
            "name": "Рюкзак городской черный",
            "description": "Практичный рюкзак для работы и учебы. Вместительный и стильный.",
            "price": 3499,
            "category": "accessories",
            "images": ["https://via.placeholder.com/300x300?text=Black+Backpack+1", "https://via.placeholder.com/300x300?text=Black+Backpack+2"],
            "characteristics": {"Материал": "Нейлон", "Объем": "30л", "Цвет": "Черный"},
            "stock_quantity": 20
        },
        {
            "name": "Трикотажные перчатки красные",
            "description": "Теплые перчатки для зимы. Удобно сенсорный экран.",
            "price": 449,
            "category": "accessories",
            "images": ["https://via.placeholder.com/300x300?text=Red+Gloves"],
            "characteristics": {"Материал": "Акрил 80%, Спандекс 20%", "Размер": "Универсальный", "Цвет": "Красный"},
            "stock_quantity": 60
        }
    ]
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        for product in test_products:
            cur.execute("""
                INSERT INTO products 
                (name, description, price, category, images, characteristics, stock_quantity)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                product['name'],
                product['description'],
                product['price'],
                product['category'],
                json.dumps(product['images']),
                json.dumps(product['characteristics']),
                product['stock_quantity']
            ))
        
        conn.commit()
        cur.close()
        conn.close()
        print(f"✅ Добавлено {len(test_products)} товаров")
        return True
    except Exception as e:
        print(f"❌ Ошибка при добавлении товаров: {e}")
        return False

def main():
    print("=" * 50)
    print("🗄️  Инициализация базы данных Befree Shop")
    print("=" * 50)
    
    # Спросим параметры подключения
    print("\n📋 Параметры подключения к PostgreSQL:")
    print(f"   Host: {os.environ.get('DB_HOST')}")
    print(f"   Port: {os.environ.get('DB_PORT')}")
    print(f"   Database: {os.environ.get('DB_NAME')}")
    print(f"   User: {os.environ.get('DB_USER')}")
    print("\n💡 Если параметры неверны, измените переменные окружения:")
    print("   $env:DB_HOST='localhost'")
    print("   $env:DB_PORT='5432'")
    print("   $env:DB_NAME='befree_shop'")
    print("   $env:DB_USER='postgres'")
    print("   $env:DB_PASSWORD='your_password'")
    
    input("\nНажмите Enter для начала инициализации...")
    
    # Создаем схему
    if not init_schema():
        sys.exit(1)
    
    # Загружаем тестовые данные
    if not load_seed_data():
        print("⚠️  Тестовые данные из seed.sql не загружены (возможно, они уже существуют)")
    
    # Добавляем товары
    if not add_test_products():
        print("⚠️  Товары не добавлены (возможно, они уже существуют)")
    
    print("\n" + "=" * 50)
    print("✨ Инициализация завершена!")
    print("=" * 50)
    print("\n🚀 Далее запустите backend:")
    print("   python backend/app.py")

if __name__ == '__main__':
    main()
