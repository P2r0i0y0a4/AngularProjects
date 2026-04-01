import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { postProductType } from '../../Types/postProductType';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  productService = inject(ProductService);

  // Form model
  formData: postProductType = {
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
  };

  responseMessage = '';
  isLoading = false;

  onSubmit() {
    this.isLoading = true;
    this.responseMessage = '';

    this.productService.postdata(this.formData).subscribe({
      next: (response) => {
        console.log('POST success:', response);
        this.responseMessage = `✅ Product "${response.title}" added with ID: ${response.id}`;
        this.isLoading = false;
        this.resetForm();
      },
      error: (err) => {
        console.error('POST error:', err);
        this.responseMessage = '❌ Failed to add product.';
        this.isLoading = false;
      },
    });
  }

  resetForm() {
    this.formData = {
      title: '',
      price: 0,
      description: '',
      category: '',
      image: '',
    };
  }
}

