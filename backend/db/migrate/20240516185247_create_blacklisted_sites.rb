class CreateBlacklistedSites < ActiveRecord::Migration[7.1]
  def change
    create_table :blacklisted_sites do |t|
      t.string :url

      t.timestamps
    end
    add_index :blacklisted_sites, :url, unique: true
  end
end
