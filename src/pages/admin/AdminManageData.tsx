import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardApi, productsApi, categoriesApi, collectionsApi, bannersApi, usersApi, ordersApi } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download } from "lucide-react";

const AdminManageData: React.FC = () => {
  const [activeTab, setActiveTab] = useState("export");

  // Fetch data counts
  const { data: counts, isLoading: isLoadingCounts, refetch } = useQuery({
    queryKey: ["dataCounts"],
    queryFn: dashboardApi.getDataCounts,
  });

  const handleExport = async (dataType: string) => {
    try {
      toast.info(`Exporting ${dataType} data...`);
      const response = await dashboardApi.exportData(dataType);
      
      // Create a blob from the response data
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${dataType}-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`${dataType} data exported successfully!`);
    } catch (error) {
      console.error(`Error exporting ${dataType} data:`, error);
      toast.error(`Failed to export ${dataType} data. Please try again.`);
    }
  };

  const handleImport = async (dataType: string, file: File) => {
    try {
      toast.info(`Importing ${dataType} data...`);
      
      // Read the file content
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          // Call the appropriate API based on data type
          let response;
          switch (dataType) {
            case "products":
              // For each product in the data array
              for (const product of data) {
                await productsApi.createProduct(product);
              }
              break;
            case "categories":
              for (const category of data) {
                await categoriesApi.createCategory(category);
              }
              break;
            case "collections":
              for (const collection of data) {
                await collectionsApi.createCollection(collection);
              }
              break;
            case "banners":
              for (const banner of data) {
                await bannersApi.createBanner(banner);
              }
              break;
            default:
              throw new Error(`Unsupported data type: ${dataType}`);
          }
          
          toast.success(`${dataType} data imported successfully!`);
          refetch(); // Refresh data counts
        } catch (error) {
          console.error(`Error processing ${dataType} import:`, error);
          toast.error(`Failed to import ${dataType} data. Please check the file format.`);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error(`Error importing ${dataType} data:`, error);
      toast.error(`Failed to import ${dataType} data. Please try again.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, dataType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImport(dataType, file);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Management</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export your store data in JSON format for backup or migration purposes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Products</CardTitle>
                    <CardDescription>
                      {isLoadingCounts ? "Loading..." : `${counts?.products || 0} products available`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleExport("products")}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Products
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Categories</CardTitle>
                    <CardDescription>
                      {isLoadingCounts ? "Loading..." : `${counts?.categories || 0} categories available`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleExport("categories")}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Categories
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Collections</CardTitle>
                    <CardDescription>
                      {isLoadingCounts ? "Loading..." : `${counts?.collections || 0} collections available`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleExport("collections")}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Collections
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Orders</CardTitle>
                    <CardDescription>
                      {isLoadingCounts ? "Loading..." : `${counts?.orders || 0} orders available`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleExport("orders")}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Orders
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Users</CardTitle>
                    <CardDescription>
                      {isLoadingCounts ? "Loading..." : `${counts?.users || 0} users available`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleExport("users")}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Users
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Banners</CardTitle>
                    <CardDescription>
                      {isLoadingCounts ? "Loading..." : `${counts?.banners || 0} banners available`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleExport("banners")}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Banners
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Full Database</CardTitle>
                  <CardDescription>
                    Export all data from your store database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleExport("all")}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export All Data
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>
                Import data from JSON files. This will add new records but won't update existing ones.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Products</CardTitle>
                    <CardDescription>
                      Import product data from JSON file
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="products-import"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "products")}
                      />
                      <Button 
                        onClick={() => document.getElementById("products-import")?.click()}
                        className="w-full"
                        variant="outline"
                      >
                        Select Products File
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Categories</CardTitle>
                    <CardDescription>
                      Import category data from JSON file
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="categories-import"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "categories")}
                      />
                      <Button 
                        onClick={() => document.getElementById("categories-import")?.click()}
                        className="w-full"
                        variant="outline"
                      >
                        Select Categories File
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Collections</CardTitle>
                    <CardDescription>
                      Import collection data from JSON file
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="collections-import"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "collections")}
                      />
                      <Button 
                        onClick={() => document.getElementById("collections-import")?.click()}
                        className="w-full"
                        variant="outline"
                      >
                        Select Collections File
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Banners</CardTitle>
                    <CardDescription>
                      Import banner data from JSON file
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="banners-import"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "banners")}
                      />
                      <Button 
                        onClick={() => document.getElementById("banners-import")?.click()}
                        className="w-full"
                        variant="outline"
                      >
                        Select Banners File
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-amber-800">Important Note</CardTitle>
                </CardHeader>
                <CardContent className="text-amber-700">
                  <p>
                    Importing data will add new records to your database. It won't update existing records.
                    Make sure your import files are properly formatted JSON files exported from this system.
                  </p>
                  <p className="mt-2">
                    For large imports, the process may take some time. Please be patient and don't refresh the page.
                  </p>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button onClick={() => refetch()}>
                  Refresh Data Counts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManageData;
